/*global $, document, mw, prompt, window*/
/*jslint white: true, plusplus: true, regexp: true */
$(function () {
'use strict';

var link, $link, encodedBookName, user, proj, code, d, mes, ano, path, catNS, regexes;

if ( $.inArray( mw.config.get( 'wgDBname' ), [ 'ptwikibooks', 'wikilocaldb' ] ) !== -1 && mw.config.get( 'wgNamespaceNumber' ) === 0 ) {
	encodedBookName = mw.util.wikiUrlencode( mw.config.get( 'wgBookName' ) );
	link = '//toolserver.org/~pathoschild/catanalysis/?title='
		+ encodedBookName + '&cat=0&wiki=ptwikibooks_p';
	mw.util.addPortletLink( 'p-tb', link, 'Estatísticas do livro', 't-catanalysis', 'Ver estatísticas sobre este livro', 't', '#t-whatlinkshere');
	link = mw.util.wikiGetlink( 'Special:RecentChangesLinked' )
		+ '?days=30&limit=500&target=Categoria:Livro/' + encodedBookName;
	mw.util.addPortletLink('p-navigation',
		link,
		'Mudanças neste livro',
		'ca-bookrecentchanges',
		'Exibir mudanças recentes neste livro',
		null,
		'#n-recentchanges + li'
	);
}

if ( 0 <= mw.config.get( 'wgNamespaceNumber' ) ) {
	link = mw.util.wikiGetlink( 'Special:RecentChangesLinked/' + mw.config.get('wgPageName') )
		+ '?namespace=0&showlinkedto=1&days=30&limit=500';
	mw.util.addPortletLink('p-navigation',
		link,
		'Mudanças relacionadas',
		'ca-recentchangeslinked',
		'Exibir mudanças recentes nas páginas que apontam para esta',
		null,
		'#n-recentchanges + li'
	);
}

/**
	* Special:WhatLinksHere edit, history and delete links
	*
	* Adds "edit", "hist" and "delete" link to [[Special:WhatLinksHere]]
	*
	* @source: [[mw:Snippets/Special:WhatLinksHere history link]]
	* @rev: 2
	* TODO: Add chekboxes to show/hide each extra button
	*/
$( '#mw-whatlinkshere-list li, #editform .templatesUsed li' ).each( function() {
	var	url = mw.config.get( 'wgScript' ) + '?title=' + encodeURIComponent( $( 'a:first', this ).text() ) + '&action=',
		sel = 'Whatlinkshere' === mw.config.get( 'wgCanonicalSpecialPageName' ) ? '.mw-whatlinkshere-tools a:last' : 'a:last';
	$( sel, this )
		.after( $( '<a>' ).attr( 'href', url + 'delete' ).text( 'delete' ) ).after( ' | ' )
		.after( $( '<a>' ).attr( 'href', url + 'history' ).text( 'hist' ) ).after( ' | ' )
		//TODO: Não inserir se for o '.templatesUsed'
		.after( $( '<a>' ).attr( 'href', url + 'edit' ).text( 'edit' ) ).after( ' | ' );
});

//Adiciona ligações editar, links e hist à tela exibida depois de mover uma página
if ( 'Movepage' === mw.config.get( 'wgCanonicalSpecialPageName' ) ) {
	if ( 'Página movida com sucesso' === $( '#firstHeading' ).text() ){
		//Ficará obsoleto se e quando for possível usar [[MediaWiki:Movepage-page-moved]] com $3 e $4 (ver translatewiki)
		$( '#bodyContent ul:eq(1) li' ).each( function() {
			var	$mov = $(this).find( 'a' ),
				url = [
					mw.config.get( 'wgScript' ) + '?title=' + encodeURIComponent( $mov.eq(0).text() ) + '&action=',
					mw.config.get( 'wgScript' ) + '?title=' + encodeURIComponent( $mov.eq(1).text() ) + '&action='
				];
			$mov.each(function( index ) {
				$(this).after( ' ) ' )
					.after( $( '<a>' ).attr( 'href', url[ index ] + 'delete' ).text( 'delete' ) ).after( ' | ' )
					.after( $( '<a>' ).attr( 'href', url[ index ] + 'history' ).text( 'hist' ) ).after( ' | ' )
					.after( $( '<a>' ).attr( 'href', mw.util.wikiGetlink( 'Special:WhatLinksHere/' + $(this).text() ) ).text( 'links' ) ).after( ' | ' )
					.after( $( '<a>' ).attr( 'href', url[ index ] + 'edit' ).text( 'edit' ) ).after( ' ( ' );
			});
		});
	}
}
//Adiciona uma ligação para as contribuições globais de um usuário
if ( $.inArray( mw.config.get( 'wgNamespaceNumber' ), [ 2, 3 ] ) !== -1
	|| 'Contributions' === mw.config.get('wgCanonicalSpecialPageName') ){
	if ( mw.config.get('wgNamespaceNumber') === -1 ){
			user = $('#contentSub a:first').text();
	} else {
			user = mw.config.get( 'wgTitle' ).split( '/' )[0];
	}
	mw.util.addPortletLink( 'p-tb', '//toolserver.org/~luxo/contributions/contributions.php?user=' + mw.util.wikiUrlencode( user ), 'Contribuições globais', 't-global', 'Ver as contribuições globais de ' + user, 'g', '#t-contributions + li' );

	// Rename default link
	$( '#t-contributions a' ).text( 'Contribuições');
}

if ( mw.config.get( 'wgNamespaceNumber' ) >= 0 ) {
	$( mw.util.addPortletLink('p-cactions',
		'#',
		'WikiBlame',
		'ca-blame',
		'Identificar o autor de um trecho da página, usando o WikiBlame'
	)).click( function( e ) {
		e.preventDefault();
		var tip = 'Digite um texto no campo abaixo para saber quem o incluiu na página atual.',
			url = 'http://wikipedia.ramselehof.de/wikiblame.php?',
			data = {
				'article': mw.config.get('wgPageName'),
				'user_lang': mw.config.get('wgUserLanguage').replace(/-.+/g, ''),
				'lang': mw.config.get('wgContentLanguage'),
				'needle': prompt(tip, 'Texto'),
				'project': mw.config.get('wgServer')
					.replace( /\/\/[a-z]+\.([a-z]+).org/, '$1' )
			};
		window.open( url + $.param( data ), '_blank');
	});
}


//Adiciona ao topo das mensagens de sistema uma aba com ligação para o Translatewiki
if (8 === mw.config.get( 'wgNamespaceNumber' ) ) {
	mw.util.addPortletLink('p-namespaces', '//translatewiki.net/wiki/' + mw.util.wikiUrlencode( mw.config.get( 'wgPageName' ) ) + '/pt', 'Translatewiki', 'ca-trans', 'Ver a mesma mensagem no translatewiki.net');
}

//Adiciona uma ligação na barra lateral para mostrar as estatísticas sobre a visualização da página exibida
proj = mw.config.get( 'wgDBname' ).replace( /^.+(wiki.*)$/g, '$1' );
code = {
	'wiki': '',
	'wikibooks': '.b',
	'wiktionary': '.d',
	'wikiquote': '.q',
	'wikinews': '.n',
	'wikisource': '.s',
	'wikiversity': '.v'
};

link = 'http://stats.grok.se/' + mw.config.get( 'wgContentLanguage' ) + code[proj] + '/';
d=new Date();
mes = d.getMonth()+1;
mes = mes<10? '0'.concat(mes): mes;
ano = d.getFullYear();
link = link.concat(ano).concat(mes) + '/' + mw.config.get( 'wgPageName' );
mw.util.addPortletLink( 'p-tb', link, 'Exibições da página', 't-stat', 'Ver estatísticas sobre a visualização desta página', 't', '#t-whatlinkshere');



//Subpáginas
if (document.getElementById('p-tb') && $.inArray( mw.config.get( 'wgNamespaceNumber' ), [ -1, 6] ) === -1){
	link = mw.util.wikiGetlink( 'Special:PrefixIndex/' + mw.config.get( 'wgPageName' ) );
	mw.util.addPortletLink('p-tb', link, 'Subpáginas', 't-subpages', 'Subpáginas desta página');
}

// Add a short permanent link (without 'title=...')
$link = $( '#t-permalink a' ).text('Link perm.');
if ( $link.size() ) {
	$link.after( $( '<a>' )
		.attr( 'href', $link.attr( 'href' ).replace( /title=[^&]*&/, '' ) )
		.text( 'Link curto' )
	).after( ' / ' );
}
/**
	* ShortDiff-link
	*
	* When clicking a diff-link shorten it to:
	* https://wiki.org/w/index.php?diff=1[&oldid=1]
	* Due to rewrite rules may not work by default on wikis outside Wikimedia.
	*
	* @source: [[meta:MediaWiki:Gadget-ShortDiff.js]]
	* @author: Krinkle
	* @revision: 2
	*/
$(function () {
	$('a').live('click', function () {
		var	href = $(this).attr('href'),
			diffVal = mw.util.getParamValue('diff', href),
			newHref, oldidVal;
		if (!href || $.inArray( diffVal, [undefined, null, '', 0, '0', 'cur'] ) !== -1 || $(this).parent().attr( 'id' ) === 't-permalink' ) {
			return;
		}
		newHref = mw.config.get('wgScript') + '?diff=' + diffVal;
		oldidVal = mw.util.getParamValue('oldid', href);
		if (oldidVal) {
			newHref += '&oldid=' + oldidVal;
		}
		$(this).attr('href', newHref);
	});
});

//Workaround for [[bugzilla:10410]]
//Convert link syntax [[zz]] to true links on javascript and css pages
path = mw.config.get('wgArticlePath');
catNS = mw.config.get('wgFormattedNamespaces')['14'];
regexes = [
	[ // [[Links like this]]
		/\[\[\s*([^\|\]]+?)\s*\]\]/ig,
		'[[<a href="' + path + '">$1</a>]]'
	],
	[ // [[Links like this|with an alternative text]]
		/\[\[\s*([^\|\]]+?)\s*\|\s*([^\]]+?)\s*\]\]/ig,
		'[[<a href="' + path + '">$2</a>]]'
	],
	[ // [[Category:Links|with an index for sorting]]
		new RegExp('\\[\\[<a href="' + path.replace('$1', '(?:Category|' + catNS + '):([^"]+)') + '">([^<]+)</a>\\]\\]', 'gi'),
		'[[<a href="' + path.replace('$1', 'Category:$1') + '">' + catNS + ':$1</a>|$2]]'
	],
	[ // Links to MediaWiki site (Workaround for [[bugzilla:22407]])
		/href="\/wiki\/mw:/ig,
		'href="' + '//www.mediawiki.org/wiki/'
	]
];

function createLinks(t) {
	var i;
	for (i=0; i< regexes.length; i++) {
		t = t.replace(regexes[i][0], regexes[i][1]);
	}
	return t;
}

if ($.inArray(mw.config.get('wgNamespaceNumber'), [2, 8]) !== -1 && mw.config.get('wgPageName').match(/\.(js|css)$/) && $.inArray(mw.config.get('wgAction'), ['view', 'purge']) !== -1) {
	$('#bodyContent pre')
		.first().find('span.coMULTI, span.co1') //FIXME: "span.st0" makes this too slow =(
		.each(function () {
			$(this).html(createLinks($(this).html()));
		});
}

});
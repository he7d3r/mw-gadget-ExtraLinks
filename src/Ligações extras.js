/**
 * Add some extra links
 * @author: [[User:Helder.wiki]]
 * @tracking: [[Special:GlobalUsage/User:Helder.wiki/Tools/Ligações extras.js]] ([[File:User:Helder.wiki/Tools/Ligações extras.js]])
 */
/*jshint browser: true, camelcase: true, curly: true, eqeqeq: true, immed: true, latedef: true, newcap: true, noarg: true, noempty: true, nonew: true, quotmark: true, undef: true, unused: true, strict: true, trailing: true, laxbreak: true, devel: true, maxlen: 120, evil: true, onevar: true */
/*global jQuery, mediaWiki */
( function ( mw, $ ) {
'use strict';

var link, $link, encodedBookName, user, proj, code, specialPermaLink;

if ( $.inArray( mw.config.get( 'wgDBname' ), [ 'ptwikibooks', 'my_wiki' ] ) !== -1
	&& mw.config.get( 'wgNamespaceNumber' ) === 0
) {
	encodedBookName = mw.util.wikiUrlencode( mw.config.get( 'wgBookName' ) );
	link = '//toolserver.org/~pathoschild/catanalysis/?title='
		+ encodedBookName + '&cat=0&wiki=ptwikibooks_p';
	mw.util.addPortletLink(
		'p-tb',
		link,
		'Estatísticas do livro',
		't-catanalysis',
		'Ver estatísticas sobre este livro',
		't',
		'#t-whatlinkshere'
	);
	link = mw.util.wikiGetlink( 'Special:RecentChangesLinked' )
		+ '?days=30&limit=500&target=Categoria:Livro/' + encodedBookName;
	mw.util.addPortletLink(
		'p-navigation',
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
	mw.util.addPortletLink(
		'p-navigation',
		link,
		'Mudanças relacionadas',
		'ca-recentchangeslinked',
		'Exibir mudanças recentes nas páginas que apontam para esta',
		null,
		'#n-recentchanges + li'
	);
}

// Adiciona uma ligação para as contribuições globais de um usuário
if ( $.inArray( mw.config.get( 'wgNamespaceNumber' ), [ 2, 3 ] ) !== -1
	|| 'Contributions' === mw.config.get('wgCanonicalSpecialPageName')
){
	if ( mw.config.get('wgNamespaceNumber') === -1 ){
		user = $('input[name="target"]').val();
	} else {
		user = mw.config.get( 'wgTitle' ).split( '/' )[0];
	}
	mw.util.addPortletLink(
		'p-tb',
		'//toolserver.org/~luxo/contributions/contributions.php?user=' + mw.util.wikiUrlencode( user ),
		'Contribuições globais',
		't-global',
		'Ver as contribuições globais de ' + user,
		'g',
		'#t-contributions + li'
	);

	// Rename default link
	$( '#t-contributions' ).find( 'a' ).text( 'Contribuições');
}


//Adiciona ao topo das mensagens de sistema uma aba com ligação para o Translatewiki
if ( 8 === mw.config.get( 'wgNamespaceNumber' ) ) {
	mw.util.addPortletLink(
		'p-namespaces',
		'//translatewiki.net/wiki/' + mw.util.wikiUrlencode( mw.config.get( 'wgPageName' ) ) +
			( mw.config.get( 'wgPageName' ).indexOf( '/' ) === -1 ? '/pt' : '' ),
		'Translatewiki',
		'ca-trans',
		'Ver a mesma mensagem no Translatewiki.net'
	);
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

mw.util.addPortletLink(
	'p-tb',
	'http://stats.grok.se/' + mw.config.get( 'wgContentLanguage' ) + code[proj] +
		'/latest90/' + mw.config.get( 'wgPageName' ),
	'Exibições da página',
	't-stat',
	'Ver estatísticas sobre a visualização desta página',
	't',
	'#t-whatlinkshere'
);



// Subpáginas
if ( document.getElementById('p-tb') && $.inArray( mw.config.get( 'wgNamespaceNumber' ), [ -1, 6 ] ) === -1 ){
	link = mw.util.wikiGetlink( 'Special:PrefixIndex/' + mw.config.get( 'wgPageName' ) );
	mw.util.addPortletLink( 'p-tb', link, 'Subpáginas', 't-subpages', 'Subpáginas desta página' );
}

// Add a short permanent link (without 'title=...')
$link = $( '#t-permalink' ).find( 'a' ).text( 'Link perm.' );
specialPermaLink = 'Special:PermaLink/' + mw.util.getParamValue( 'oldid', $link.attr( 'href' ) );
$link.after(
	' / ',
	$( '<a>' )
		.attr(
			'href',
			mw.util.wikiGetlink( specialPermaLink )
		)
		.text( '[[wiki]]' )
		.click( function( e ){
			e.preventDefault();
			prompt(
				'Ligação interna:',
				'[[' + specialPermaLink + ']]'
			);
		} )
);

}( mediaWiki, jQuery ) );
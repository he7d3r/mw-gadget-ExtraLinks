/** Adiciona ligações para os correlatos na barra lateral ([[MediaZilla:708]])
 * Adiciona links para os correlatos informados com [[Template:Correlatos]],
 * nas páginas especiais e nas mensagens do MediaWiki
 * @see [[wikt:de:MediaWiki:Onlyifsystem.js]]
 * @see [[commons:MediaWiki:InterProject.js]]
 * @see [[MediaWiki:Common.js]]
 * @author [[wikt:de:Melancholie]]
 * @author [[wikt:de:Pill]]
 * @author [[wikt:de:Spacebirdy]]
 * @author [[wikt:de:Balû]]
 * @author [[commons:User:Ilmari Karonen]]
 * @author [[commons:User:DieBuche]]
 * @author [[commons:User:Krinkle]]
 */
function getProjectListHTML() {
	// var interPr = document.getElementById('interProject');
	// if (interPr) {
	//	return interPr.innerHTML;
	// }
	if ($.inArray(mw.config.get('wgNamespaceNumber'), [-1, 2, 3, 8, 9]) === -1) {
		return null;
	}

	var wiki = [ ], url, proto, server,
		cLang = mw.config.get( 'wgContentLanguage' ),
        langRegExp = new RegExp( '^' + cLang ),
		projName = mw.config.get( 'wgDBname' ),
		pageURLbegin = mw.config.get('wgServer') + mw.config.get('wgArticlePath').replace('/wiki/$1', ''),
		canonicalName = mw.config.get('wgCanonicalNamespace'),
		pageURLend = decodeURI(document.URL.replace(pageURLbegin, ''));

	//If the wiki has versions in each language, wgDBname starts with the language code
	if ( langRegExp.test(projName) ) {
		projName = projName.replace(langRegExp, '');
		if (projName === 'wiki') {
			projName = 'wikipedia';
		}
	}


	wiki = wiki.concat( [
		{ text: 'Wikipédia', http: '$1.wikipedia', https: 'wikipedia/$1' },
		{ text: 'Wikilivros', http: '$1.wikibooks', https: 'wikibooks/$1' },
		{ text: 'Wikisource', http: '$1.wikisource', https: 'wikisource/$1' },
		{ text: 'Wikcionário', http: '$1.wiktionary', https: 'wiktionary/$1' },
		{ text: 'Wikiversidade', http: '$1.wikiversity', https: 'wikiversity/$1' },
		{ text: 'Wikinotícias', http: '$1.wikinews', https: 'wikinews/$1' },
		{ text: 'Wikiquote', http: '$1.wikiquote', https: 'wikiquote/$1' },
		//Wikis without versions in each language
		{ text: 'Wikimedia Commons', http: 'commons.wikimedia', https: 'wikipedia/commons' },
		{ text: 'Meta-Wiki', http: 'meta.wikimedia', https: 'wikipedia/meta' },
		{ text: 'Wikispecies', http: 'species.wikimedia', https: 'wikipedia/species' }
	] );

	canonicalName += ':' + (mw.config.get('wgCanonicalSpecialPageName') || mw.config.get('wgTitle').replace(' ', '_'));
	pageURLend = pageURLend.replace( mw.config.get('wgPageName'), canonicalName );

	// var iProjectSys = document.createElement('div');
	// iProjectSys.style.marginTop = '0.7em';
	var list = '';
	if ( mw.config.get( 'wgServer' ).charCodeAt(4) !== 58 ) {
		server = 'https://secure.wikimedia.org/$1';
		proto = 'https';
	} else {
		server = 'http://$1.org';
		proto = 'http';
	}
	for (var i=0 ; i < wiki.length; i++ ) {
		if (wiki[i].http.indexOf(projName) !== -1){
			url = server.replace('$1', wiki[i][proto].replace('$1', (cLang !== 'pt'? 'pt' : 'en') ) ) + pageURLend;
			list += '<li><a href="' + url + '" style="font-weight:bold;">' + wiki[i].text + (cLang !== 'pt'? '' : ' (EN)') + '<\/a><\/li>';
		} else {
			url = server.replace('$1', wiki[i][proto].replace('$1', cLang)) + pageURLend;
			list += '<li><a href="' + url + '">' + wiki[i].text + '<\/a><\/li>';
		}
	}
	// list = '<h5>Correlatos<\/h5><div class="pBody"><ul>' + list + '<\/ul><\/div>';
	list = '<ul>' + list + '<\/ul>';
	return list;
	// iProjectSys.innerHTML = list;
	// document.getElementById( 'p-tb' ).appendChild( iProjectSys );
}

// TODO: Remover parte deste código quando o [[bugzilla:23515]] for resolvido
function renderProjectsPortlet() {
	var idNum;
	if (document.getElementById('p-interproject')) {
		return;  // avoid double inclusion
	}
	var listHTML = getProjectListHTML();
	if (!listHTML) {
		return;
	}

	var toolBox = document.getElementById('p-tb');
	var panel;
	if (toolBox) {
		panel = toolBox.parentNode;
	} else {
		// stupid incompatible skins...
		var panelIds = ['panel', 'column-one', 'mw_portlets', 'mw-panel'];
		for (idNum = 0; !panel && idNum < panelIds.length; idNum++) {
			panel = document.getElementById(panelIds[idNum]);
		}
		// can't find a place for the portlet, try to undo hiding
		if (!panel) {
			mw.util.addCSS('#interProject, #sisterProjects { display: block; }');
			return;
		}
	}

	var interProject = document.createElement('div');
	interProject.id = 'p-interproject';
	interProject.className = (mw.config.get('skin') === 'vector' ? 'portal' : 'portlet') + ' collapsed';

	interProject.innerHTML =
		'<h5>Correlatos<\/h5><div class="' + (mw.config.get('skin') === 'vector' ? 'body' : 'pBody') + '">' +
		listHTML + '<\/div>';

	if (toolBox && toolBox.nextSibling) {
		panel.insertBefore(interProject, toolBox.nextSibling);
	} else {
		panel.appendChild(interProject);
	}
}

if ( $.inArray( mw.config.get( 'wgDBname' ), [ 'ptwikibooks', 'wikilocaldb' ] ) !== -1 ) {
	$(function () {

		// Adiciona uma ligação para incluir um modelo da predefinição "Referência a livro"
		if (0 === mw.config.get( 'wgNamespaceNumber' ) && $.inArray( mw.config.get( 'wgAction' ), [ 'edit', 'submit' ] ) !== -1 ) { // && mw.config.get( 'wgPageName' ).match(/Referências|Bibliografia/)
			mw.util.addPortletLink('p-cactions',
				'javascript:insertTags("* {{Referência a livro|NomeAutor=",' +
							'" |SobrenomeAutor= |Título= |Subtítulo= |Edição= |Local de publicação= |Editora= |Ano= |Páginas= |Volumes= |Volume= |ID= |URL= }}",' +
							'"")',
				'+ Referência',
				'ca-ref',
				'Adicionar referência a livro',
				'+');
		}

		//Adiciona uma ligação para limpar a caixa de areia
		//TODO: Usar edição via API para que o link limpe automaticamente a página
		if ('Wikilivros:Caixa_de_areia' === mw.config.get( 'wgPageName' )) {
			mw.util.addPortletLink('p-views', mw.util.wikiGetlink( 'Wikilivros:Caixa de areia' ) + '?action=edit&oldid=116378', 'Limpar', 'ca-limpar', 'Limpar a caixa de areia');
		}
		if ( 0 === mw.config.get( 'wgNamespaceNumber' ) ) {
			encodedBookName = mw.util.wikiUrlencode( mw.config.get( 'wgBookName' ) );
			link = 'http://toolserver.org/~pathoschild/catanalysis/?title='
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
	});
} else {
	mw.util.addCSS('#interProject, #sisterProjects { display: none; }');
	addOnloadHook(renderProjectsPortlet);
}

( function( $ ) {
$(function () {
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
	 * Unwatch from watchlist
	 * Unwatchlink per item on watchlist (adds " | unwatch" for each entry)
	 * Rewritten by Krinkle (2011-01-31)
	 *
	 * @source: http://www.mediawiki.org/wiki/Snippets/Unwatch_from_watchlist
	 * @rev: 1
	 */
	function addUnwatchlink(){
		// Only on Watchlist and not in the /edit or /raw mod
		if ( mw.config.get( 'wgCanonicalSpecialPageName' ) !== 'Watchlist' || window.location.href.indexOf( '/edit' ) > 0 || window.location.href.indexOf( '/raw' ) > 0 ) {
			return false;
		}
		// Get the links
		var $wlHistLinks = $( '#content' ).find( 'ul.special > li > a[href$="action=history"]');
		$.each( $wlHistLinks, function() {
			var     $el = $( this ), // Cache the result instead of calling $() again
				$unwatch = $el.clone()
					.text( 'unwatch' )
					.css('color', 'gray')
					.attr( 'href', function( i, val ) {
						return val.replace( 'action=history', 'action=unwatch' );
					} );
			$el.after( $unwatch ).after( ' | ' );
		});
	}
	$( addUnwatchlink );

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
		var url = mw.config.get( 'wgScript' ) + '?title=' + encodeURIComponent( $( 'a:first', this ).text() ) + '&action=';
		var sel = 'Whatlinkshere' === mw.config.get( 'wgCanonicalSpecialPageName' ) ? '.mw-whatlinkshere-tools a:last' : 'a:last';
		$( sel, this )
			.after( $( '<a>' ).attr( 'href', url + 'delete' ).text( 'delete' ) ).after( ' | ' )
			.after( $( '<a>' ).attr( 'href', url + 'history' ).text( 'hist' ) ).after( ' | ' )
			//TODO: Não inserir se for o '.templatesUsed'
			.after( $( '<a>' ).attr( 'href', url + 'edit' ).text( 'edit' ) ).after( ' | ' );
	});

	//Adiciona ligações editar, links e hist à tela exibida depois de mover uma página
	if ( 'Movepage' === mw.config.get( 'wgCanonicalSpecialPageName' ) ) {
		if ( 'Página movida com sucesso' === $( '#firstHeading' ).text() ){
			//Ficará obsoleto se e quando for possível usar [[MediaWiki:Movepage-page-moved‎‎]] com $3 e $4 (ver translatewiki)
			$( '#bodyContent ul:eq(1) li' ).each( function() {
				var $mov = $(this).find( 'a' );
				var url = [
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
		var user;
		if ( mw.config.get('wgNamespaceNumber') === -1 ){
			 user = $('#contentSub a:first').text();
		} else {
			 user = mw.config.get( 'wgTitle' ).split( '/' )[0];
		}
		mw.util.addPortletLink( 'p-tb', 'http://toolserver.org/~luxo/contributions/contributions.php?user=' + mw.util.wikiUrlencode( user ), 'Contribuições globais', 't-global', 'Ver as contribuições globais de ' + user, 'g', '#t-contributions + li' );

		// Rename default link
		$( '#t-contributions a' ).text( 'Contribuições');
	}

	/**
	* Action link: Last revision diff
	*
	* @source: [[mw:Snippets/Last revision action]]
	* @rev: 3
	*/
	// Not on Special pages
	if ( !mw.config.get('wgCanonicalSpecialPageName') ) {
		var     url,
			$plink = $('#t-permalink a');
		if ( $plink.size() ) {
			url = $plink.attr('href').replace( '&oldid=', '&diff=prev&oldid=' );
		} else {
			url = mw.config.get('wgScript') + '?title=' + mw.util.wikiUrlencode( mw.config.get('wgPageName') ) + '&diff=0';
		}
		mw.util.addPortletLink( 'p-namespaces', url, '↶', 'ca-last', 'Mostrar as alterações feitas na última edição' );
	}

	if ( mw.config.get( 'wgNamespaceNumber' ) >= 0 ) {
		window.wikiBlame = {
			run: function () {
				var tip = 'Digite um texto no campo abaixo para saber quem o incluiu na página atual.',
					url = 'http://toolserver.org/~soxred93/blame/index.php?',
					server = mw.config.get('wgServer'),
					data = {
						article: encodeURIComponent(mw.config.get('wgPageName')),
						lang: encodeURIComponent(mw.config.get('wgContentLanguage')),
						text: prompt(tip, 'Texto')
					},
					urlParts = [];
				if (server.indexOf('https') > -1) {
					data.wiki = mw.config.get('wgScript').replace(/\/([a-z]+)\/.*/, '$1');
				} else {
					data.wiki = server.replace(/http:\/\/[a-z]+\.([a-z]+).org/, '$1');
				}
				for (var param in data) {
					if (data.hasOwnProperty(param) && data[param] !== '') {
						urlParts.push(param + '=' + data[param]);
					}
				}
				url += urlParts.join('&');
				window.open(url, '_blank');
			}
		};
		mw.util.addPortletLink('p-cactions',
			'javascript:window.wikiBlame.run();',
			'WikiBlame',
			'ca-blame',
			'Identificar o autor de um trecho da página, usando o WikiBlame');
	}


	//Adiciona ao topo das mensagens de sistema uma aba com ligação para o Translatewiki
	if (8 === mw.config.get( 'wgNamespaceNumber' ) ) {
		mw.util.addPortletLink('p-namespaces', 'http://translatewiki.net/wiki/' + mw.util.wikiUrlencode( mw.config.get( 'wgPageName' ) ) + '/pt', 'Translatewiki', 'ca-trans', 'Ver a mesma mensagem no translatewiki.net');
	}

	//Adiciona uma ligação na barra lateral para mostrar as estatísticas sobre a visualização da página exibida
	var proj = mw.config.get( 'wgDBname' ).replace( /^.+(wiki.*)$/g, '$1' );
	var code = {
		'wiki': '',
		'wikibooks': '.b',
		'wiktionary': '.d',
		'wikiquote': '.q',
		'wikinews': '.n',
		'wikisource': '.s',
		'wikiversity': '.v'
	};

	var link = 'http://stats.grok.se/' + mw.config.get( 'wgContentLanguage' ) + code[proj] + '/';
	var d=new Date();
	var mes = d.getMonth()+1;
	mes = mes<10? '0'.concat(mes): mes;
	var ano = d.getFullYear();
	link = link.concat(ano).concat(mes) + '/' + mw.config.get( 'wgPageName' );
	mw.util.addPortletLink( 'p-tb', link, 'Exibições da página', 't-stat', 'Ver estatísticas sobre a visualização desta página', 't', '#t-whatlinkshere');



	//Subpáginas
	if (document.getElementById('p-tb') && $.inArray( mw.config.get( 'wgNamespaceNumber' ), [ -1, 6] ) === -1){
		link = mw.util.wikiGetlink( 'Special:PrefixIndex/' + mw.config.get( 'wgPageName' ) );
		mw.util.addPortletLink('p-tb', link, 'Subpáginas', 't-subpages', 'Subpáginas desta página');
	}

	// Add a short permanent link (without 'title=...')
	var $link = $( '#t-permalink a' ).text('Link perm.');
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
	 * http://wiki.org/w/index.php?diff=1[&oldid=1]
	 * Due to rewrite rules may not work by default on wikis outside Wikimedia.
	 *
	 * @source: [[meta:MediaWiki:Gadget-ShortDiff.js]]
	 * @author: Krinkle
	 * @revision: 2
	 */
	$(function () {
		$('a').live('click', function () {
			var href = $(this).attr('href');
			var diffVal = mw.util.getParamValue('diff', href);
			if (!href || !diffVal || $(this).parent().attr( 'id' ) === 't-permalink' ) {
				return;
			}
			var newHref = mw.config.get('wgScript') + '?diff=' + diffVal;
			var oldidVal = mw.util.getParamValue('oldid', href);
			if (oldidVal) {
				newHref += '&oldid=' + oldidVal;
			}
			$(this).attr('href', newHref);
		});
	});

	//Workaround for [[bugzilla:10410]]
	//Convert link syntax [[zz]] to true links on javascript and css pages
	var path = mw.config.get('wgArticlePath'),
		catNS = mw.config.get('wgFormattedNamespaces')['14'],
		link = [/\[\[\s*([^\|\]]+?)\s*\]\]/ig, '[[<a href="' + path + '">$1</a>]]'],
		linkWithText = [/\[\[\s*([^\|\]]+?)\s*\|\s*([^\]]+?)\s*\]\]/ig, '[[<a href="' + path + '">$2</a>]]'],
		cat = [
		new RegExp('\\[\\[<a href="' + path.replace('$1', '(?:Category|' + catNS + '):([^"]+)') + '">([^<]+)</a>\\]\\]', 'gi'), '[[<a href="' + url.replace('$1', 'Category:$1') + '">' + catNS + ':$1</a>|$2]]'],
		mw = [/href="\/wiki\/mw:/ig, 'href="' + ((mw.config.get('wgServer').indexOf('https://') === 0) ? 'https://secure.wikimedia.org/wikipedia/mediawiki/wiki/' : 'http://www.mediawiki.org/wiki/')];

	function createLinks(t) {
		//[[Links like this]]
		t = t.replace(link[0], link[1]);

		//[[Links like this|with an alternative text]]
		t = t.replace(linkWithText[0], linkWithText[1]);

		//[[Category:Links|with an index for sorting]]
		t = t.replace(cat[0], cat[1]);

		//Links to MediaWiki site (Workaround for [[bugzilla:22407]])
		t = t.replace(mw[0], mw[1]);
		return t;
	}

	if ($.inArray(mw.config.get('wgNamespaceNumber'), [2, 8]) !== -1 && mw.config.get('wgPageName').match(/\.(js|css)$/) && $.inArray(mw.config.get('wgAction'), ['view', 'purge']) !== -1) {
		$('#bodyContent pre')
			.first().find('span.coMULTI, span.co1, span.st0')
			.each(function (index) {
				$(this).html(createLinks($(this).html()));
			});
	}

	var pos = document.getElementById('pt-mycontris') || document.getElementById('p-personal').getElementsByTagName('li')[0];
	mw.util.addPortletLink('p-personal', mw.util.wikiGetlink( 'Special:Watchlist' ) + '?namespace=0&days=0', '(main)', 't-main', 'Ver as páginas vigiadas no espaço nominal principal', 'g', pos);


});
} )( jQuery );
'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">pcdiga-scraper-backend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-33ac1a63ae994340debf5130ba61986e63e0776d331350a635a63f7fab6c7917b6d32dcdb018b2ea7acfb0a068f8928f490ca9152e5fb214d1b86486403e4a46"' : 'data-target="#xs-controllers-links-module-AppModule-33ac1a63ae994340debf5130ba61986e63e0776d331350a635a63f7fab6c7917b6d32dcdb018b2ea7acfb0a068f8928f490ca9152e5fb214d1b86486403e4a46"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-33ac1a63ae994340debf5130ba61986e63e0776d331350a635a63f7fab6c7917b6d32dcdb018b2ea7acfb0a068f8928f490ca9152e5fb214d1b86486403e4a46"' :
                                            'id="xs-controllers-links-module-AppModule-33ac1a63ae994340debf5130ba61986e63e0776d331350a635a63f7fab6c7917b6d32dcdb018b2ea7acfb0a068f8928f490ca9152e5fb214d1b86486403e4a46"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-33ac1a63ae994340debf5130ba61986e63e0776d331350a635a63f7fab6c7917b6d32dcdb018b2ea7acfb0a068f8928f490ca9152e5fb214d1b86486403e4a46"' : 'data-target="#xs-injectables-links-module-AppModule-33ac1a63ae994340debf5130ba61986e63e0776d331350a635a63f7fab6c7917b6d32dcdb018b2ea7acfb0a068f8928f490ca9152e5fb214d1b86486403e4a46"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-33ac1a63ae994340debf5130ba61986e63e0776d331350a635a63f7fab6c7917b6d32dcdb018b2ea7acfb0a068f8928f490ca9152e5fb214d1b86486403e4a46"' :
                                        'id="xs-injectables-links-module-AppModule-33ac1a63ae994340debf5130ba61986e63e0776d331350a635a63f7fab6c7917b6d32dcdb018b2ea7acfb0a068f8928f490ca9152e5fb214d1b86486403e4a46"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ThirdPartyEmailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ThirdPartyEmailService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AutosearchModule.html" data-type="entity-link" >AutosearchModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AutosearchModule-613e8c8627e3800c371950618d732f909f3b52334e095a368507060d195ec695fec5f8e5efc2c63692ffac28915d364bef7b39658fdefd9341d993bb4130437e"' : 'data-target="#xs-injectables-links-module-AutosearchModule-613e8c8627e3800c371950618d732f909f3b52334e095a368507060d195ec695fec5f8e5efc2c63692ffac28915d364bef7b39658fdefd9341d993bb4130437e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AutosearchModule-613e8c8627e3800c371950618d732f909f3b52334e095a368507060d195ec695fec5f8e5efc2c63692ffac28915d364bef7b39658fdefd9341d993bb4130437e"' :
                                        'id="xs-injectables-links-module-AutosearchModule-613e8c8627e3800c371950618d732f909f3b52334e095a368507060d195ec695fec5f8e5efc2c63692ffac28915d364bef7b39658fdefd9341d993bb4130437e"' }>
                                        <li class="link">
                                            <a href="injectables/AutosearchService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AutosearchService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProductsModule.html" data-type="entity-link" >ProductsModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ProductsModule-0172ba3c3ea296f221ecb5feb6d6a85106eec1cb6afd2fcc765c352a1954ee3a5e2e140abdc045d52e9d7e536d9a0cfcf76fbe4fad86739fc88b503dadcced47"' : 'data-target="#xs-injectables-links-module-ProductsModule-0172ba3c3ea296f221ecb5feb6d6a85106eec1cb6afd2fcc765c352a1954ee3a5e2e140abdc045d52e9d7e536d9a0cfcf76fbe4fad86739fc88b503dadcced47"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProductsModule-0172ba3c3ea296f221ecb5feb6d6a85106eec1cb6afd2fcc765c352a1954ee3a5e2e140abdc045d52e9d7e536d9a0cfcf76fbe4fad86739fc88b503dadcced47"' :
                                        'id="xs-injectables-links-module-ProductsModule-0172ba3c3ea296f221ecb5feb6d6a85106eec1cb6afd2fcc765c352a1954ee3a5e2e140abdc045d52e9d7e536d9a0cfcf76fbe4fad86739fc88b503dadcced47"' }>
                                        <li class="link">
                                            <a href="injectables/ProductsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ScraperModule.html" data-type="entity-link" >ScraperModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ScraperModule-0c37a43a2ed53d3ee6283fd8d38352438f3753689729b94d1226e98567c79e23dbc11f91d4f3a827df31ff8ecc523e72a3fb00afa0ee62aea86cd8c93a6745bd"' : 'data-target="#xs-injectables-links-module-ScraperModule-0c37a43a2ed53d3ee6283fd8d38352438f3753689729b94d1226e98567c79e23dbc11f91d4f3a827df31ff8ecc523e72a3fb00afa0ee62aea86cd8c93a6745bd"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ScraperModule-0c37a43a2ed53d3ee6283fd8d38352438f3753689729b94d1226e98567c79e23dbc11f91d4f3a827df31ff8ecc523e72a3fb00afa0ee62aea86cd8c93a6745bd"' :
                                        'id="xs-injectables-links-module-ScraperModule-0c37a43a2ed53d3ee6283fd8d38352438f3753689729b94d1226e98567c79e23dbc11f91d4f3a827df31ff8ecc523e72a3fb00afa0ee62aea86cd8c93a6745bd"' }>
                                        <li class="link">
                                            <a href="injectables/ScraperService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ScraperService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ThirdPartyModule.html" data-type="entity-link" >ThirdPartyModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ThirdPartyModule-01172f5aaea7305e33efb42c3f18b0a3311028e20dade0cb12502f1a3a4d9825d961e0468626f0f7b0ff43fd82adfc460beab817ef09f13332debda8ed68b04a"' : 'data-target="#xs-injectables-links-module-ThirdPartyModule-01172f5aaea7305e33efb42c3f18b0a3311028e20dade0cb12502f1a3a4d9825d961e0468626f0f7b0ff43fd82adfc460beab817ef09f13332debda8ed68b04a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ThirdPartyModule-01172f5aaea7305e33efb42c3f18b0a3311028e20dade0cb12502f1a3a4d9825d961e0468626f0f7b0ff43fd82adfc460beab817ef09f13332debda8ed68b04a"' :
                                        'id="xs-injectables-links-module-ThirdPartyModule-01172f5aaea7305e33efb42c3f18b0a3311028e20dade0cb12502f1a3a4d9825d961e0468626f0f7b0ff43fd82adfc460beab817ef09f13332debda8ed68b04a"' }>
                                        <li class="link">
                                            <a href="injectables/ThirdPartyEmailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ThirdPartyEmailService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#controllers-links"' :
                                'data-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AutosearchResolver.html" data-type="entity-link" >AutosearchResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProductInput.html" data-type="entity-link" >CreateProductInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProductPriceInput.html" data-type="entity-link" >CreateProductPriceInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/IMutation.html" data-type="entity-link" >IMutation</a>
                            </li>
                            <li class="link">
                                <a href="classes/IQuery.html" data-type="entity-link" >IQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/Product.html" data-type="entity-link" >Product</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductAutoSearch.html" data-type="entity-link" >ProductAutoSearch</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductAutoSearchInput.html" data-type="entity-link" >ProductAutoSearchInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductFilter.html" data-type="entity-link" >ProductFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductPrice.html" data-type="entity-link" >ProductPrice</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProductsResolver.html" data-type="entity-link" >ProductsResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProductInput.html" data-type="entity-link" >UpdateProductInput</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AutosearchService.html" data-type="entity-link" >AutosearchService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProductsService.html" data-type="entity-link" >ProductsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ScraperService.html" data-type="entity-link" >ScraperService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ThirdPartyEmailService.html" data-type="entity-link" >ThirdPartyEmailService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CreateProductInput.html" data-type="entity-link" >CreateProductInput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateProductPriceInput.html" data-type="entity-link" >CreateProductPriceInput</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IMutation.html" data-type="entity-link" >IMutation</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IQuery.html" data-type="entity-link" >IQuery</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Product.html" data-type="entity-link" >Product</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProductAutoSearch.html" data-type="entity-link" >ProductAutoSearch</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProductPrice.html" data-type="entity-link" >ProductPrice</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateProductInput.html" data-type="entity-link" >UpdateProductInput</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
// es5 and 6 polyfills, powered by babel
require("babel/polyfill")

var $ = require('jquery'),
	Backbone = require('backbone')
let fetch = require('./fetcher')
console.log('javascript loaded')
// other stuff that we don't really use in our own code
// var Pace = require("../bower_components/pace/pace.js")

// require your own libraries, too!
// var Router = require('./app.js')

// window.addEventListener('load', app)

// function app() {
    // start app
    // new Router()
// }


// === MODEL - single Etsy item 
var EtsyModel = Backbone.Model.extend({
	
	// url: 'https://openapi.etsy.com/v2/listings/active.js?api_key=aavnvygu0h5r52qes74x9zvo&includes=Images',
	url: 'https://openapi.etsy.com/v2/listings/',

	apikey: 'aavnvygu0h5r52qes74x9zvo',

	parse: function(responseData){
		console.log('model request', responseData.results[0])
		return responseData.results[0]
	}
})


// === COLLECTION - 25 items in array
var EtsyCollection = Backbone.Collection.extend({
	
	url:function(){
		return 'https://openapi.etsy.com/v2/listings/active.js?api_key=aavnvygu0h5r52qes74x9zvo&includes=MainImage'
	},
})

// === VIEW - view collection on #home route
var EtsyView = Backbone.View.extend({

	el: '#container',

	events: {"click button": "etsyDetailsGoTo"},

	etsyDetailsGoTo: function(event){
		var buttonEl = event.target,
			listEl = buttonEl.parentElement,
			singleEtsyItem = listEl.getAttribute('data-iditem')
		location.hash = `details/${singleEtsyItem}`
	},

	displayTitleHome: function(){
		// console.log('view.dTH run')
		var self = this
		var listings = self.collection.models[0].attributes.results
		// console.log('rTA', resultsTitlesArr)
		var titlesHtml = ''
		listings.forEach(function(listing){
			var itemImg = listing.MainImage.url_570xN
			var title = listing.title
			titlesHtml += `	<img src="${itemImg}">
							<div data-idItem="${listing.listing_id}">${title}
							<button type="button">i</button>
							</div>`
		})
		// console.log(titlesHtml)
		return titlesHtml
	},

	render: function(){
		console.log('view.render run')
		// console.log(this.collection)
		
		this.$el.html(
			`<input type="text">
			<div id="activelistings">${this.displayTitleHome()}</div>`
		)
	},

	initialize: function(){
		console.log('stuff in the collection', this.collection)
		this.listenTo(this.collection, "update", this.render)
		console.log('stuff in the group view', this)
		// this.render()
	}
})

// === VIEW - details on single Etsy item
var EtsySingleView = Backbone.View.extend({

	el: "#container",

	descriptionSingleItem: function(){return this.model.attributes.description},

	imagesSingleItem: function(){return this.model.attributes.Images[0].url_570xN},

	priceSingleItem: function(){return this.model.attributes.price},

	titleSingleItem: function(){return this.model.attributes.title},
	
	urlSingleItem: function(){return this.model.attributes.url},

	displaySingleItem: function(){this.$el.html(
		`<div id=title>${this.titleSingleItem()}</div></br>
		<img id=images src=${this.imagesSingleItem()}></br></br>
		<div id=description>${this.descriptionSingleItem()}</div></br>
		<div id=price>Price: $ ${this.priceSingleItem()}</div></br>
		<div id=url>URL: <a href=${this.urlSingleItem()}>${this.urlSingleItem()}</a></div></br>`
	)},

	render: function(){
		console.log('stuff in the model', this.model)
		this.displaySingleItem()
	}
})

// === CONTROLLER/ROUTER
var EtsyRouter = Backbone.Router.extend({
	routes: {
		'home': 'homePage',
		'details/:idItem': 'detailsPage',
		'*anyroute': 'defaultPage'
	},

	defaultPage: function(){
		location.hash = 'home'
	},

	detailsPage: function(idItem){
		console.log('router.detailsPage')
		var self = this
		this.eModel.fetch({
			url: `https://openapi.etsy.com/v2/listings/${idItem}.js`,
			data: {
				api_key: this.eModel.apikey,
				includes: 'Images'
				},
			dataType: 'jsonp',
			processData: true
		}).done(function(){
			// console.log(self.eModel)
			self.eSingleView.render()
		})
	},

	homePage: function(){
		// console.log('router.homepage run')
		this.eCollection.fetch({
			data: {includes: 'MainImage'},
			dataType: 'jsonp'
		})
	},

	initialize: function(){
		this.eModel = new EtsyModel
		this.eCollection = new EtsyCollection()
		this.eView = new EtsyView({collection: this.eCollection})
		console.log('stuff in the router', this)
		this.eCollection.state = 'empty'
		this.eSingleView = new EtsySingleView({model: this.eModel})
		Backbone.history.start()
	}
})

var eRouter = new EtsyRouter()
// var eV = new EtsyView()

// var theProperty = 'helloKitty'
// myObj.helloKitty
// myObj[theProperty]











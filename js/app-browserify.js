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
	
	url: 'https://openapi.etsy.com/v2/listings/active.js?api_key=aavnvygu0h5r52qes74x9zvo&includes=MainImage&callback=',

	parse: function(responseData){
		console.log('model request', responseData)
		return responseData
	}
})


// === COLLECTION - 25 items in array
var EtsyCollection = Backbone.Collection.extend({
	
	url:function(){
		return 'https://openapi.etsy.com/v2/listings/active.js?api_key=aavnvygu0h5r52qes74x9zvo&includes=MainImage&callback='
	}
})

// === VIEW - list on #home route
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
		// var resultsTitlesArr = self.collection.models[0].attributes.results
		var listings = self.collection.models[0].attributes.results
		// console.log('rTA', resultsTitlesArr)
		var titlesHtml = ''
		// resultsTitlesArr.forEach(function(titleArr){
		listings.forEach(function(listing){
			var title = listing.title
			titlesHtml += `<li data-idItem="${listing.listing_id}">${title}
							<button type="button">i</button>
							</li>`
		})
		// console.log(titlesHtml)
		return titlesHtml
	},

	render: function(){
		console.log('view.render run')
		// console.log(this.collection)
		
		this.$el.html(
			`<input type="text">
			<div id="titleslistdiv">
				<ul id="titlelistul">${this.displayTitleHome()}</ul>
			</div>`
		)
	},

	initialize: function(){
		console.log('stuff in the collection', this.collection)
		this.listenTo(this.collection, "update", this.render)
		console.log('stuff in the view', this)
		// this.render()
	}
})

// === VIEW - details on single Etsy item
var EtsySingleView = Backbone.View.extend({

	el: "#container",

	render: function(){
		console.log('EtsySingleView.render run')
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
		if(this.eCollection.state === 'empty'){
			//state-dependent, relies on starting from #home and click
			var eModel = new EtsyModel()
			this.eSingleView.model = eModel
			console.log(eModel)
			// console.log(this.eSingleView.model)
			var renderSingleView = this.eSingleView.render.bind(this.eSingleView)
			//fetch

		}
	},

	homePage: function(){
		// console.log('router.homepage run')
		this.eCollection.fetch({
			// data: {includes: MainImage},
			dataType: 'jsonp'
		})
	},

	initialize: function(){
		this.eCollection = new EtsyCollection()
		this.eView = new EtsyView({collection: this.eCollection})
		console.log('stuff in the router', this)
		this.eCollection.state = 'empty'
		this.eSingleView = new EtsySingleView()
		Backbone.history.start()
	}
})

var eRouter = new EtsyRouter()
// var eV = new EtsyView()

// var theProperty = 'helloKitty'
// myObj.helloKitty
// myObj[theProperty]











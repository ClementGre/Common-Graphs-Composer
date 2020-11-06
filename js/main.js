
Vue.component("app-nav", {
	template: `<header>
		<div><img src="img/icon.png"></img><h2>Common Graphs Composer [BETA]</h2></div>
		<nav><ul><li><a href="index.html">Home</a></li><li><a href="timeline.html">Timeline</a></li></ul></nav>
	</header>`,

	props: [],
	methods: {
		
	}
});

Vue.component("app-footer", {
	template: `<footer><h5>Copyright &copy Common Graphs Composer 2020</h5><h5>Developed by <a href="https://github.com/clementgre/" target="_blank" style="color: white; cursor: pointer;">Clément Grennerat</a></h5></footer>`,
	props: [],
	methods: {
		
	}
});

var app = new Vue({
	el: "#app",
	data: {
		
	},
	methods: {
		
	}
});
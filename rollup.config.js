import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import postcss from "rollup-plugin-postcss";
import autoPreprocess from 'svelte-preprocess';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;
	
	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'es',
		name: 'app',
		dir: 'public/build/editor'
	},
	plugins: [
		svelte({
			// Optionally, preprocess components with svelte.preprocess:
			// https://svelte.dev/docs#svelte_preprocess
			preprocess: {
				style: ({ content }) => {
					return transformStyles(content);
				}
			},
			emitCss: false,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			// css: css => {
			// 	css.write('bundle-editor.css');
			// },
			preprocess: autoPreprocess(),
			// You can pass any of the Svelte compiler options
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production,
				// By default, the client-side compiler is used. You
				// can also use the server-side rendering compiler
				//generate: 'ssr',
		
				// ensure that extra attributes are added to head
				// elements for hydration (used with generate: 'ssr')
				//hydratable: true,
		
				// You can optionally set 'customElement' to 'true' to compile
				// your components to custom elements (aka web elements)
				//customElement: false
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		postcss({
			extract: true,
			minimize: true,
			use: [
				['sass', {
					includePaths: [
						'./src/theme',
						'./node_modules'
					]
				}]
			]
		}),
		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};

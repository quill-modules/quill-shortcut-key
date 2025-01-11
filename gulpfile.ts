import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import autoprefixer from 'autoprefixer';
import { dest, parallel, series, src, task, watch } from 'gulp';
import cleanCSS from 'gulp-clean-css';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import gulpSass from 'gulp-sass';
import { rollup } from 'rollup';
import { dts } from 'rollup-plugin-dts';
import sass from 'sass';

const sassPlugin = gulpSass(sass);

const __dirname = dirname(fileURLToPath(import.meta.url));
const distBundle = resolve(__dirname, './dist');
const demoBundle = resolve(__dirname, './docs');

const buildDts = async () => {
  const bundle = await rollup({
    input: './src/index.ts',
    external: ['quill'],
    treeshake: true,
    plugins: [dts({ tsconfig: './tsconfig.json' })],
  });
  return bundle.write({
    file: resolve(distBundle, 'index.d.ts'),
    sourcemap: false,
    format: 'es',
  });
};
const buildTs = async (isDev: boolean = false) => {
  const plugins = [typescript({ tsconfig: './tsconfig.json' }), nodeResolve(), terser()];
  const bundle = await rollup({
    input: './src/index.ts',
    external: ['quill'],
    treeshake: true,
    plugins,
  });
  if (isDev) {
    await bundle.write({
      file: resolve(demoBundle, 'dev.js'),
      sourcemap: true,
      format: 'umd',
      name: 'QuillShortcutKey',
      exports: 'named',
      globals: {
        quill: 'Quill',
      },
    });
  }

  await bundle.write({
    file: resolve(distBundle, 'index.umd.js'),
    sourcemap: true,
    format: 'umd',
    name: 'QuillShortcutKey',
    exports: 'named',
    globals: {
      quill: 'Quill',
    },
  });
  return bundle.write({
    file: resolve(distBundle, 'index.js'),
    sourcemap: true,
    format: 'es',
  });
};
const buildTheme = async (isDev: boolean = false) => {
  const bunlde = await src('src/style/index.scss')
    .pipe(sassPlugin().on('error', sassPlugin.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(
      rename((p) => {
        if (p.dirname.startsWith('src\\')) {
          p.dirname = p.dirname.replace(/src\\/, '');
          console.log(p);
        }
      }),
    );
  if (!isDev) {
    await bunlde
      .pipe(
        cleanCSS({}, (details) => {
          console.log(
            `${details.name}: ${details.stats.originalSize / 1000} KB -> ${details.stats.minifiedSize / 1000
            } KB`,
          );
        }),
      )
      .pipe(dest(distBundle));
  }
  return bunlde.pipe(dest(demoBundle));
};

const dev = () => {
  watch('./src/**/*.ts', parallel(buildTs.bind(undefined, true), buildDts));
  watch('./src/**/*.scss', buildTheme.bind(undefined, true));
};
task('dev', series(dev));

task('default', parallel(
  buildTs.bind(undefined, false),
  buildDts,
  buildTheme.bind(undefined, false),

  buildTs.bind(undefined, true),
  buildTheme.bind(undefined, true),
));

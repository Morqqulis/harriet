import fs from 'fs';
import { promises as fsPromises } from 'fs';
import fonter from 'gulp-fonter-fix';
import ttf2woff2 from 'gulp-ttf2woff2';

export const otfToTtf = () => {
	return app.gulp.src(`${app.path.srcFolder}/fonts/*.otf`, {})
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "FONTS",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(fonter({
			formats: ['ttf']
		}))
		.pipe(app.gulp.dest(`${app.path.srcFolder}/fonts/`));
}

export const ttfToWoff = () => {
	return app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, {})
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "FONTS",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(fonter({
			formats: ['woff']
		}))
		.pipe(app.gulp.dest(`${app.path.build.fonts}`));
}

export const ttfToWoff2 = () => {
	return app.gulp.src(`${app.path.srcFolder}/fonts/*.ttf`, {})
		.pipe(app.plugins.plumber(
			app.plugins.notify.onError({
				title: "FONTS",
				message: "Error: <%= error.message %>"
			}))
		)
		.pipe(ttf2woff2())
		.pipe(app.gulp.dest(`${app.path.build.fonts}`));
}

export const copyExistingWoff = () => {
	return app.gulp.src([
		`${app.path.srcFolder}/fonts/*.{woff,woff2}`
	], { encoding: false })
		.pipe(app.gulp.dest(`${app.path.build.fonts}`));
}
export const fonstStyle = async () => {
	const fontsFile = `${app.path.srcFolder}/scss/fonts/fonts.scss`;
	
	if (app.isFontsReW && fs.existsSync(fontsFile)) {
		await fsPromises.unlink(fontsFile);
	}

	try {
		const fontsFiles = await fsPromises.readdir(app.path.build.fonts);
		
		if (!fontsFiles.length) {
			if (fs.existsSync(fontsFile)) {
				await fsPromises.unlink(fontsFile);
			}
			return app.gulp.src(`${app.path.srcFolder}`);
		}

		if (fs.existsSync(fontsFile)) {
			console.log("Файл scss/fonts/fonts.scss уже существует. Для обновления файла нужно его удалить!");
			return app.gulp.src(`${app.path.srcFolder}`);
		}

		await fsPromises.writeFile(fontsFile, '');
		
		const processedFonts = new Set();
		
		for (const fontFile of fontsFiles) {
			const fontFileName = fontFile.split('.')[0];
			
			if (processedFonts.has(fontFileName)) continue;
			
			const [fontName, fontWeightStr] = fontFileName.split('-');
			const fontWeight = getFontWeight(fontWeightStr || 'regular');
			
			const fontFaceRule = `@font-face {\n\tfont-family: ${fontName};\n\tfont-display: swap;\n\tsrc: url("../fonts/${fontFileName}.woff2") format("woff2"), url("../fonts/${fontFileName}.woff") format("woff");\n\tfont-weight: ${fontWeight};\n\tfont-style: normal;\n}\r\n`;
			
			await fsPromises.appendFile(fontsFile, fontFaceRule);
			processedFonts.add(fontFileName);
		}
	} catch (error) {
		if (fs.existsSync(fontsFile)) {
			await fsPromises.unlink(fontsFile);
		}
	}
	
	return app.gulp.src(`${app.path.srcFolder}`);
}

const getFontWeight = (weightStr) => {
	const weights = {
		thin: 100,
		extralight: 200,
		light: 300,
		regular: 400,
		medium: 500,
		semibold: 600,
		bold: 700,
		extrabold: 800,
		heavy: 800,
		black: 900
	};
	
	return weights[weightStr.toLowerCase()] || 400;
}
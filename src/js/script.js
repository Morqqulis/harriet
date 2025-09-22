// Подключение функционала "Чертогов Фрилансера"
// import { isMobile } from "./files/functions.js";
// Подключение списка активных модулей
// import { flsModules } from "./files/modules.js";

const moreBtn = document.querySelector('.about__more-btn');
if (moreBtn) {
	moreBtn.addEventListener('click', () => {
		const more = document.querySelector('.about__more');
		more.classList.toggle('about__more_active');
	});
}

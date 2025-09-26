// Подключение функционала "Чертогов Фрилансера"
// import { isMobile } from "./files/functions.js";
// Подключение списка активных модулей
// import { flsModules } from "./files/modules.js";
import Macy from 'macy'

const header = document.querySelector('.header')
const currentPage = window.location.pathname
if (currentPage !== '/' && currentPage !== '/index.html') {
	header.classList.add('header_padding')
}

const moreBtn = document.querySelector('.about__more-btn')
if (moreBtn) {
	moreBtn.addEventListener('click', () => {
		const more = document.querySelector('.about__more')
		more.classList.toggle('about__more_active')
	})
}

let macyInstances = new Map()
let resizeTimeout = null

function initMacy(container) {
	if (macyInstances.has(container)) {
		return macyInstances.get(container)
	}

	const macyInstance = Macy({
		container: container,
		columns: 3,
		margin: {
			x: 48,
			y: 64,
		},
		breakAt: {
			768: {
				columns: 1,
				margin: {
					x: 24,
					y: 32,
				},
			},
			1024: {
				columns: 2,
				margin: {
					x: 34,
					y: 48,
				},
			},
		},
		align: 'left',
		waitForImages: true,
		useOwnImageLoader: false,
	})

	macyInstances.set(container, macyInstance)
	return macyInstance
}

function initMacyForActiveTab() {
	const activeTab = document.querySelector('.tabs__body:not([hidden])')
	if (activeTab) {
		const articlesContainer = activeTab.querySelector('.tabs__articles')
		if (articlesContainer) {
			initMacy(articlesContainer)
		}
	}
}

function recalculateAllMacy() {
	macyInstances.forEach(instance => {
		if (instance && typeof instance.recalculate === 'function') {
			try {
				instance.recalculate()
			} catch (error) {
				console.warn('Macy recalculate error:', error)
			}
		}
	})
}

function destroyInactiveMacy() {
	const activeTab = document.querySelector('.tabs__body:not([hidden])')
	const activeContainer = activeTab?.querySelector('.tabs__articles')
	
	macyInstances.forEach((instance, container) => {
		if (container !== activeContainer && instance) {
			try {
				instance.destroy()
				macyInstances.delete(container)
			} catch (error) {
				console.warn('Macy destroy error:', error)
			}
		}
	})
}

initMacyForActiveTab()

document.addEventListener('click', e => {
	if (e.target.closest('[data-tabs-title]')) {
		const tabTitle = e.target.closest('[data-tabs-title]')
		const tabsBlock = tabTitle.closest('[data-tabs]')
		
		if (tabsBlock) {
			const currentActiveTab = tabsBlock.querySelector('.tabs__body:not([hidden])')
			
			if (currentActiveTab) {
				currentActiveTab.style.opacity = '0'
				currentActiveTab.style.transform = 'translateY(10px)'
			}
			
			setTimeout(() => {
				destroyInactiveMacy()
				initMacyForActiveTab()
				
				const newActiveTab = tabsBlock.querySelector('.tabs__body:not([hidden])')
				if (newActiveTab) {
					newActiveTab.style.opacity = '1'
					newActiveTab.style.transform = 'translateY(0)'
				}
			}, 150)
		}
	}
})

window.addEventListener('resize', () => {
	if (resizeTimeout) {
		clearTimeout(resizeTimeout)
	}
	
	resizeTimeout = setTimeout(() => {
		recalculateAllMacy()
	}, 250)
})

document.addEventListener('DOMContentLoaded', () => {
	const images = document.querySelectorAll('.tabs__articles img')
	images.forEach(img => {
		if (img.complete) {
			img.classList.add('loaded')
		} else {
			img.addEventListener('load', () => {
				img.classList.add('loaded')
				recalculateAllMacy()
			})
		}
	})
})

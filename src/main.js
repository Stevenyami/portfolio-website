import './style.css'
import { initScanFigure } from './scan-figure.js'

const header = document.querySelector('.site-header')
const menuButton = document.querySelector('.menu-toggle')
const navigation = document.querySelector('#primary-nav')

if (header && menuButton && navigation) {
  const menuLabel = menuButton.querySelector('.menu-label')
  const desktop = window.matchMedia('(min-width: 768px)')

  function setMenuOpen(isOpen) {
    menuButton.setAttribute('aria-expanded', String(isOpen))
    menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu')
    navigation.classList.toggle('is-open', isOpen)
    if (menuLabel) menuLabel.textContent = isOpen ? 'Close' : 'Menu'
  }

  function menuIsOpen() {
    return menuButton.getAttribute('aria-expanded') === 'true'
  }

  header.classList.add('nav-enhanced')
  menuButton.hidden = false

  menuButton.addEventListener('click', () => {
    setMenuOpen(!menuIsOpen())
  })

  navigation.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return

      const wasOpen = menuIsOpen()
      const target = document.getElementById(link.hash.slice(1))
      setMenuOpen(false)

      if (wasOpen) {
        // Keep keyboard focus in the destination after the mobile menu closes.
        if (target) target.focus({ preventScroll: true })
        else menuButton.focus({ preventScroll: true })
      }
    })
  })

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !menuIsOpen()) return

    const focusInMenu = navigation.contains(document.activeElement)
      || menuButton === document.activeElement
    setMenuOpen(false)
    if (focusInMenu) menuButton.focus({ preventScroll: true })
  })

  document.addEventListener('click', (event) => {
    if (!menuIsOpen() || header.contains(event.target)) return

    const focusInMenu = navigation.contains(document.activeElement)
    setMenuOpen(false)
    if (focusInMenu) menuButton.focus({ preventScroll: true })
  })

  desktop.addEventListener('change', (event) => {
    const focusWillHide = !event.matches && navigation.contains(document.activeElement)
    const triggerWillHide = event.matches && menuButton === document.activeElement
    setMenuOpen(false)
    if (focusWillHide) menuButton.focus({ preventScroll: true })
    if (triggerWillHide) navigation.querySelector('a')?.focus({ preventScroll: true })
  })
}

const year = document.querySelector('#year')
if (year) year.textContent = String(new Date().getFullYear())

initScanFigure()

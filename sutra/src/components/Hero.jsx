
import './Hero.css'
import heroCollage from '../assets/images/sutra-hero-collage.png'

function Hero() {
  function handleShopCollection() {
    document
      .getElementById('featured-products')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
  }

  return (
    <section className="hero">
      <img
        className="hero-collage"
        src={heroCollage}
        alt="Sutrā handmade jewellery collection featuring colourful thread necklaces and earrings"
      />

      <button
        className="hero-shop-button"
        onClick={handleShopCollection}
        type="button"
      >
        Shop Collection
        <span aria-hidden="true">→</span>
      </button>
    </section>
  )
}

export default Hero

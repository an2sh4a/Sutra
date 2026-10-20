
import { useEffect, useState } from 'react'

const DISMISSED_KEY = 'sutra-promo-dismissed'

function FloatingPromo() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISSED_KEY) === 'true') return
    } catch {
      // Continue if browser storage is unavailable.
    }

    const timer = window.setTimeout(() => setVisible(true), 2000)
    return () => window.clearTimeout(timer)
  }, [])

  function dismiss() {
    setVisible(false)

    try {
      sessionStorage.setItem(DISMISSED_KEY, 'true')
    } catch {
      // The banner can still be closed if storage is unavailable.
    }
  }

  function exploreCollection() {
    dismiss()

    document.getElementById('featured-products')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  if (!visible) return null

  return (
    <>
      <aside
        className="sutra-floating-promo"
        aria-label="Sutrā delivery offer"
      >
        <button
          type="button"
          className="sutra-promo-close"
          onClick={dismiss}
          aria-label="Close promotion"
        >
          ×
        </button>

        <div className="sutra-promo-ribbon">
          <div className="sutra-promo-main">
            <span className="sutra-promo-eyebrow">
              A LITTLE EXTRA LOVE FROM SUTRĀ
            </span>

            <h2>FREE DELIVERY</h2>

            <p>NO HIDDEN CHARGES.</p>
          </div>
        </div>

        <button
          type="button"
          className="sutra-promo-cta"
          onClick={exploreCollection}
        >
          SHOP THE COLLECTION
          <span aria-hidden="true">↗</span>
        </button>
      </aside>

      <style>{`
        .sutra-floating-promo {
          position: fixed;
          left: 24px;
          bottom: 24px;
          z-index: 1200;
          width: min(510px, calc(100vw - 36px));
          box-sizing: border-box;
          padding: 10px;
          background: #fffaf2;
          border: 1px solid rgba(110, 66, 37, .2);
          border-radius: 13px;
          box-shadow: 0 16px 48px rgba(43, 29, 19, .28);
          animation: sutraPromoEnter .42s ease both;
        }

        .sutra-promo-close {
          position: absolute;
          z-index: 2;
          top: 14px;
          right: 14px;
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, .45);
          border-radius: 50%;
          background: rgba(48, 34, 25, .25);
          color: #fffaf2;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          transition: background .2s ease;
        }

        .sutra-promo-close:hover {
          background: rgba(48, 34, 25, .5);
        }

        .sutra-promo-ribbon {
          position: relative;
          display: flex;
          align-items: center;
          min-height: 148px;
          overflow: hidden;
          padding: 22px 24px;
          border-radius: 8px;
          background: linear-gradient(
            112deg,
            #3a261d 0%,
            #5a3928 58%,
            #7b4b31 100%
          );
          color: #fff8ed;
        }

        .sutra-promo-ribbon::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .12;
          background-image: radial-gradient(
            circle at 1px 1px,
            #f1d8b0 1px,
            transparent 0
          );
          background-size: 13px 13px;
        }

        .sutra-promo-main {
          position: relative;
          z-index: 1;
          width: 100%;
          min-width: 0;
        }

        .sutra-promo-eyebrow {
          display: block;
          margin: 0 32px 9px 0;
          color: #e9cda4;
          font-size: 16px;
          font-weight: 700;
          letter-spacing: 1.8px;
        }

        .sutra-promo-main h2 {
          margin: 0;
          color: #fffaf2;
          font-family: Arial, Helvetica, sans-serif;
          font-size: clamp(32px, 4vw, 42px);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -1.2px;
        }

        .sutra-promo-main p {
          margin: 12px 0 0;
          color: #fff1df;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 1.1px;
          line-height: 1.5;
        }

        .sutra-promo-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          margin-top: 9px;
          padding: 14px;
          border: 0;
          border-radius: 6px;
          background: #ead2ad;
          color: #38271d;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.3px;
          cursor: pointer;
          transition: background .2s ease;
        }

        .sutra-promo-cta:hover {
          background: #dfbd8d;
        }

        @keyframes sutraPromoEnter {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 480px) {
          .sutra-floating-promo {
            left: 12px;
            bottom: 12px;
            width: calc(100vw - 24px);
            padding: 7px;
          }

          .sutra-promo-ribbon {
            min-height: 125px;
            padding: 20px 14px;
          }

          .sutra-promo-eyebrow {
            margin-bottom: 9px;
            font-size: 8px;
            letter-spacing: 1.2px;
          }

          .sutra-promo-main h2 {
            font-size: clamp(27px, 8vw, 36px);
            letter-spacing: -.8px;
          }

          .sutra-promo-main p {
            max-width: 280px;
            margin-top: 10px;
            font-size: 8px;
            letter-spacing: .7px;
          }

          .sutra-promo-close {
            top: 10px;
            right: 10px;
            width: 25px;
            height: 25px;
            font-size: 19px;
          }

          .sutra-promo-cta {
            padding: 13px 10px;
            font-size: 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sutra-floating-promo {
            animation: none;
          }

          .sutra-promo-cta {
            transition: none;
          }
        }
      `}</style>
    </>
  )
}

export default FloatingPromo

import './CategoryBar.css'

function CategoryBar({

  selectedCategory,

  setSelectedCategory

}){

  return(

    <div className="category-bar">

      <span

        onClick={() =>
          setSelectedCategory('all')
        }

      >
        All
      </span>


      <span

        onClick={() =>
          setSelectedCategory('earrings')
        }

      >
        Earrings
      </span>


      <span

        onClick={() =>
          setSelectedCategory('bracelet')
        }

      >
        Bracelets
      </span>


      <span

        onClick={() =>
          setSelectedCategory('necklace')
        }

      >
        Necklaces
      </span>


    </div>

  )

}

export default CategoryBar
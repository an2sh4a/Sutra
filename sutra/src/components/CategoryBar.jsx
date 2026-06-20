import './CategoryBar.css'

function CategoryBar({ filterCategory }) {

  return (

    <div className="category-bar">

      <span onClick={() => filterCategory("Chains")}>
        Chains
      </span>

      <span onClick={() => filterCategory("Earrings")}>
        Earrings
      </span>

      <span onClick={() => filterCategory("Hair Clips")}>
        Hair Clips
      </span>

      <span onClick={() => filterCategory("Bracelets")}>
        Bracelets
      </span>

      <span onClick={() => filterCategory("Sets")}>
        Sets
      </span>

      <span onClick={() => filterCategory("Necklaces")}>
        Necklaces
      </span>

      <span onClick={() => filterCategory("All")}>
        All
      </span>

    </div>

  )

}

export default CategoryBar
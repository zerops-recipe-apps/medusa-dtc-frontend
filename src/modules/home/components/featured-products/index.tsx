import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/featured-products/product-rail"
import ProductPreview from "@modules/products/components/product-preview"
import InteractiveLink from "@modules/common/components/interactive-link"
import { Text } from "@modules/common/components/ui"

export default async function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  if (collections.length > 0) {
    return collections.map((collection) => (
      <li key={collection.id}>
        <ProductRail collection={collection} region={region} />
      </li>
    ))
  }

  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      fields: "*variants.calculated_price",
      limit: 12,
    },
  })

  if (!products?.length) {
    return null
  }

  return (
    <li>
      <div className="content-container py-12 small:py-24">
        <div className="flex justify-between mb-8">
          <Text className="txt-xlarge">Latest Drops</Text>
          <InteractiveLink href="/store">View all</InteractiveLink>
        </div>
        <ul className="grid grid-cols-2 small:grid-cols-3 gap-x-6 gap-y-24 small:gap-y-36">
          {products.map((product) => (
            <li key={product.id}>
              <ProductPreview product={product} region={region} isFeatured />
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

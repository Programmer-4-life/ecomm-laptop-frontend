
const Loader = () => {
  return (
    <section className="loader">
      <div></div>
    </section>
  )
}

export default Loader

interface SkeletonProps {
  width?: string;
  length?: number;
}

export const Skeleton = ({ width = "unset", length = 3 }: SkeletonProps) => {

  const skeletons = Array.from({ length }, (_, index) => {
    return (
      <div key={index} className="skeleton-shape"></div>
    )
  })
  return (
    <div className="skeleton-loader" style={{ width: width }}>
      {skeletons}
    </div>
  )
}
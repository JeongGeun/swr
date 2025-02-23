import Article from '../component/Article'
import fetch from '../libs/fetch'
import { unstable_serialize } from 'swr/infinite'
import { SWRConfig } from 'swr'

export const getServerSideProps = async () => {
  // Fetch data from external API
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_page=1&_limit=1`
  )
  return {
    props: {
      fallback: {
        [unstable_serialize(
          index => `https://jsonplaceholder.typicode.com/posts?_page=1&_limit=1`
        )]: [res]
      }
    }
  }
}

export default function App({ fallback }) {
  console.log(fallback)
  return (
    <SWRConfig value={{ fallback }}>
      <Article />
    </SWRConfig>
  )
}

import { SearchQuery } from '~/models/requests/search.request'
import databaseService from '~/services/database.service'

class SearchService {
  async search({ limit, page, content }: { limit: number; page: number; content: string }) {
    //$text nó sẽ tìm kiếm trong các trường có index text, sau khi tìm kiếm các trường có index text xong thì sau đó $search sẽ tìm kiếm trong các trường có index text có giá trị giống với content
    const result = await databaseService.tweets
      .find({ $text: { $search: content } })
      .skip(limit * (page - 1))
      .limit(limit)
      .toArray()
    return result
  }
}

const searchService = new SearchService()

export default searchService

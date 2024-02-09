import { Pagination } from '~/models/requests/tweet.request'
import { MediaTypeQuery } from '~/constants/enum'

export interface SearchQuery extends Pagination {
  content: string
  media_type: MediaTypeQuery
}

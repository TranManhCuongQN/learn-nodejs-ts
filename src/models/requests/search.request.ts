import { Pagination } from '~/models/requests/tweet.request'

export interface SearchQuery extends Pagination {
  content: string
}

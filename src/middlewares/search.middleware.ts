import { checkSchema } from 'express-validator'
import { MediaTypeQuery, PeopleFollow } from '~/constants/enum'
import { validate } from '~/utils/validation'

export const searchValidator = validate(
  checkSchema(
    {
      content: {
        isString: {
          errorMessage: 'Content must be string'
        }
      },
      media_type: {
        // optional: true nghĩa là nó có thể không có, nếu có thì phải là một trong các giá trị của MediaTypeQuery
        optional: true,
        isIn: {
          options: [Object.values(MediaTypeQuery)]
        },
        errorMessage: `Media type must be one of ${Object.values(MediaTypeQuery).join(', ')}`
      },
      people_follow: {
        // optional: true nghĩa là nó có thể không có, nếu có thì phải là một trong các giá trị của PeopleFollow
        optional: true,
        isIn: {
          options: [Object.values(PeopleFollow)],
          errorMessage: 'People follow must be 0 or 1'
        }
      }
    },
    ['query']
  )
)

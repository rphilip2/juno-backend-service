import { google } from 'googleapis'
import { USER } from '../../constants/globalConstants'
import { authMiddleware } from '../../middleware/authMiddleware'
import messageEncoding from '../../utils/messageEncoding'
import formFieldParser from '../../utils/formFieldParser'

async function setupDraft(auth, req) {
  const gmail = google.gmail({ version: 'v1', auth })

  try {
    if ('body' in req) {
      const parsedResult: any = await formFieldParser(req)
      const { threadId } = parsedResult

      const response = await gmail.users.drafts.create({
        userId: USER,
        requestBody: {
          message: {
            raw: messageEncoding(parsedResult),
            threadId: threadId[0],
          },
        },
      })

      if (response?.status === 200) {
        return response
      } else {
        return new Error('Draft is not created...')
      }
    }
  } catch (err) {
    throw Error(`Create Draft returned an error ${err}`)
  }
}

export const createDraft = async (req, res) => {
  authMiddleware(setupDraft)(req, res)
}

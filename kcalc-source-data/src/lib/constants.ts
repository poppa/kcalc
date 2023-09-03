import { join } from 'path'

export const Version = '20230613'
export const RawXmlFile = join(
  import.meta.url.replace('file:', ''),
  '..',
  '..',
  '..',
  'xml',
  'livsmedelsverket',
  `${Version}.xml`
)

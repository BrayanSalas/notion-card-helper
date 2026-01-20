import { createClient } from '@supabase/supabase-js'

let supabase = null

const getSupabaseClient = () => {
  if (!supabase) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    )
  }
  return supabase
}

/**
 * @author Brayan Salas
 * @description Upload a file to Supabase Storage
 * @param {string} bucket - Bucket name
 * @param {string} path - Path to save the file (e.g., 'uploads/image.png')
 * @param {Buffer|File} file - File to upload
 * @param {Object} options - Additional options
 * @param {string} options.contentType - MIME type of the file
 * @param {boolean} options.upsert - Sobrescribir si existe (default: false)
 * @returns {Promise<Object>} - { data, error, publicUrl }
 */
export const uploadFile = async (bucket, path, file, options = {}) => {
  const { contentType, upsert = false } = options

  const { data, error } = await getSupabaseClient()
    .storage
    .from(bucket)
    .upload(path, file, {
      contentType,
      upsert,
    })

  if (error) {
    throw new Error(`Error uploading file: ${error.message}`)
  }

  // Obtener URL pública
  const { data: urlData } = getSupabaseClient()
    .storage
    .from(bucket)
    .getPublicUrl(path)

  return {
    data,
    publicUrl: urlData.publicUrl,
  }
}

export default getSupabaseClient

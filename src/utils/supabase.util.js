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
 * Sube un archivo al storage de Supabase
 * @param {string} bucket - Nombre del bucket
 * @param {string} path - Ruta donde guardar el archivo (ej: 'uploads/imagen.png')
 * @param {Buffer|File} file - Archivo a subir
 * @param {Object} options - Opciones adicionales
 * @param {string} options.contentType - Tipo MIME del archivo
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

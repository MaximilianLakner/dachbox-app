import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test function to check database schema
export async function checkDachboxSchema() {
  try {
    // Try to get the table structure
    const { data, error } = await supabase
      .from('dachboxes')
      .select('*')
      .limit(0)
    
    if (error) {
      console.error('Schema check error:', error)
      return { success: false, error }
    }
    
    console.log('Schema check successful')
    return { success: true, data }
  } catch (error) {
    console.error('Schema check failed:', error)
    return { success: false, error }
  }
}

// Test minimal insert to identify constraints
export async function testMinimalInsert(userId: string) {
  try {
    const testData = {
      user_id: userId,
      model: 'Test Model',
      brand: 'Test Brand',
      volume: 100,
      length: 100,
      width: 50,
      height: 30,
      mounting_type: 'quertraeger-u-buegel',
      pickup_city: 'Test City',
      pickup_postal_code: '12345',
      description: 'Test description',
      condition: 'good',
      price_per_day: 10,
      includes_roof_rack: false,
      has_lock: false,
      extras: [],
      images: [],
      is_available: true
    }
    
    console.log('Testing minimal insert with data:', testData)
    
    const { data, error } = await supabase
      .from('dachboxes')
      .insert(testData)
      .select('id')
      .single()
    
    if (error) {
      console.error('Minimal insert error:', error)
      return { success: false, error }
    }
    
    // Clean up test record
    if (data?.id) {
      await supabase.from('dachboxes').delete().eq('id', data.id)
    }
    
    console.log('Minimal insert successful')
    return { success: true, data }
  } catch (error) {
    console.error('Minimal insert failed:', error)
    return { success: false, error }
  }
}

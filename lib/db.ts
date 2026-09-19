import postgres from 'postgres';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres.bqqbsvuokbyscktmlbvn:cruelmathur%40456@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

// Initialize postgres client with SSL
export const sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false },
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export async function saveUserAndPreferencesToSupabase(data: {
  email: string;
  fullName: string;
  profession?: string;
  categories: string[];
  voice?: string;
  briefLength?: string;
  deliveryTime?: string;
  language?: string;
  location?: string;
  notificationsEnabled?: boolean;
}) {
  const {
    email,
    fullName,
    profession = 'Founder / Builder',
    categories = ['AI & Tech', 'Markets', 'Startups'],
    voice = 'Aria',
    briefLength = '10 min',
    deliveryTime = '07:00 AM',
    language = 'English',
    notificationsEnabled = true,
  } = data;

  try {
    // 1. Find or create auth.users entry
    const existing = await sql`SELECT id FROM auth.users WHERE email = ${email} LIMIT 1`;
    let userId: string;

    const userMetaData = {
      full_name: fullName,
      profession,
      voice,
      brief_length: briefLength,
      delivery_time: deliveryTime,
      language,
      notifications_enabled: notificationsEnabled,
    };

    if (existing.length > 0) {
      userId = existing[0].id;
      await sql`
        UPDATE auth.users SET
          raw_user_meta_data = ${JSON.stringify(userMetaData)},
          updated_at = now()
        WHERE id = ${userId}
      `;
    } else {
      const inserted = await sql`
        INSERT INTO auth.users (
          id,
          aud,
          role,
          email,
          email_confirmed_at,
          raw_app_meta_data,
          raw_user_meta_data,
          created_at,
          updated_at
        ) VALUES (
          gen_random_uuid(),
          'authenticated',
          'authenticated',
          ${email},
          now(),
          '{"provider":"email","providers":["email"]}',
          ${JSON.stringify(userMetaData)},
          now(),
          now()
        )
        RETURNING id
      `;
      userId = inserted[0].id;
    }

    // 2. Upsert into public.preferences
    const result = await sql`
      INSERT INTO public.preferences (
        user_id,
        categories,
        full_name,
        profession,
        voice,
        brief_length,
        delivery_time,
        language,
        notifications_enabled,
        updated_at
      ) VALUES (
        ${userId},
        ${categories},
        ${fullName},
        ${profession},
        ${voice},
        ${briefLength},
        ${deliveryTime},
        ${language},
        ${notificationsEnabled},
        now()
      )
      ON CONFLICT (user_id) DO UPDATE SET
        categories = EXCLUDED.categories,
        full_name = EXCLUDED.full_name,
        profession = EXCLUDED.profession,
        voice = EXCLUDED.voice,
        brief_length = EXCLUDED.brief_length,
        delivery_time = EXCLUDED.delivery_time,
        language = EXCLUDED.language,
        notifications_enabled = EXCLUDED.notifications_enabled,
        updated_at = now()
      RETURNING *
    `;

    return {
      success: true,
      userId,
      preferences: result[0],
    };
  } catch (err: unknown) {
    console.error('Failed to save user and preferences directly to Supabase:', err);
    throw err;
  }
}

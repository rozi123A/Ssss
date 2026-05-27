import { db, usersTable, roomsTable, roomMembersTable, messagesTable, notificationsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  await db.execute(sql`
    INSERT INTO users (username, display_name, status, role) VALUES
      ('nexus_admin', 'مدير النظام', 'online', 'admin'),
      ('amira_tech', 'أميرة التقنية', 'online', 'user'),
      ('rayan_dev', 'ريان المطور', 'away', 'user'),
      ('sara_design', 'سارة التصميم', 'offline', 'user'),
      ('khalid_cyber', 'خالد السيبر', 'online', 'user')
    ON CONFLICT (username) DO NOTHING
  `);

  await db.execute(sql`
    INSERT INTO rooms (name, description, is_private, created_by) VALUES
      ('عام', 'الغرفة العامة للجميع', false, 1),
      ('تطوير البرمجيات', 'نقاشات التقنية والكود', false, 1),
      ('تصميم الواجهات', 'UI/UX وتجربة المستخدم', false, 2),
      ('الأمن السيبراني', 'مناقشات الأمن والحماية', false, 5),
      ('عشوائي', 'دردشة حرة بلا حدود', false, 1)
    ON CONFLICT DO NOTHING
  `);

  await db.execute(sql`
    INSERT INTO room_members (room_id, user_id) VALUES
      (1,1),(1,2),(1,3),(1,4),(1,5),
      (2,1),(2,2),(2,3),
      (3,2),(3,4),
      (4,1),(4,5),
      (5,1),(5,2),(5,3)
    ON CONFLICT DO NOTHING
  `);

  await db.execute(sql`
    INSERT INTO messages (room_id, user_id, content, type) VALUES
      (1, 1, 'مرحباً بالجميع في NEXUS COMM!', 'text'),
      (1, 2, 'أهلاً وسهلاً، النظام يبدو رائعاً', 'text'),
      (1, 3, 'جاهز للعمل على المشاريع الجديدة', 'text'),
      (2, 2, 'من يريد مراجعة الكود الجديد؟', 'text'),
      (2, 3, 'أنا جاهز، أرسل الرابط', 'text'),
      (4, 5, 'تحديث جديد في بروتوكولات الأمان', 'text'),
      (5, 1, 'NEXUS COMM جاهز للانطلاق!', 'text')
    ON CONFLICT DO NOTHING
  `);

  await db.execute(sql`
    INSERT INTO notifications (user_id, type, title, content, is_read) VALUES
      (1, 'system', 'مرحباً بك في NEXUS COMM', 'تم تفعيل النظام بنجاح', false),
      (1, 'message', 'رسالة جديدة', 'أميرة التقنية أرسلت رسالة في الغرفة العامة', false)
    ON CONFLICT DO NOTHING
  `);

  console.log("✅ Seeding complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

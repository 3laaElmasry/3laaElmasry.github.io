-- Alaa Elmasry portfolio: content tables for the admin dashboard.
-- Run this once in the Supabase SQL Editor. It is safe to run again.
--
-- Access model: anyone can read the content (the site is public), and only
-- users listed in public.admins can change it. Signing up is not enough.

-- ---------- tables ----------

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create table if not exists public.projects (
  id text primary key,
  sort_order integer not null default 0,
  featured boolean not null default false,
  published boolean not null default true,
  name text not null,
  url text not null,
  domain text not null default '',
  category jsonb not null default '{"en":"","ar":""}',
  metric jsonb,
  highlight jsonb,
  tags jsonb not null default '{"en":[],"ar":[]}',
  one_liner jsonb not null default '{"en":"","ar":""}',
  challenge jsonb,
  what_i_built jsonb not null default '{"en":"","ar":""}',
  result jsonb,
  screenshots jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.skill_groups (
  id text primary key,
  sort_order integer not null default 0,
  label jsonb not null default '{"en":"","ar":""}',
  items jsonb not null default '[]'
);

create table if not exists public.socials (
  id text primary key,
  sort_order integer not null default 0,
  label text not null,
  url text not null,
  icon text not null default 'link',
  visible boolean not null default true
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null
);

create index if not exists projects_sort_order_idx on public.projects (sort_order);

-- ---------- row-level security ----------

alter table public.admins enable row level security;
alter table public.projects enable row level security;
alter table public.skill_groups enable row level security;
alter table public.socials enable row level security;
alter table public.site_settings enable row level security;

-- A signed-in user may see only their own admin row. The policies below
-- read this table as that user, so this is what makes the admin check work.
drop policy if exists "admins read own row" on public.admins;
create policy "admins read own row" on public.admins
  for select to authenticated
  using ((select auth.uid()) = user_id);

do $$
declare
  t text;
begin
  foreach t in array array['projects', 'skill_groups', 'socials', 'site_settings'] loop
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);

    execute format('drop policy if exists "admin insert" on public.%I', t);
    execute format(
      'create policy "admin insert" on public.%I for insert to authenticated
         with check (exists (select 1 from public.admins a where a.user_id = (select auth.uid())))', t);

    execute format('drop policy if exists "admin update" on public.%I', t);
    execute format(
      'create policy "admin update" on public.%I for update to authenticated
         using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())))
         with check (exists (select 1 from public.admins a where a.user_id = (select auth.uid())))', t);

    execute format('drop policy if exists "admin delete" on public.%I', t);
    execute format(
      'create policy "admin delete" on public.%I for delete to authenticated
         using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())))', t);
  end loop;
end $$;

-- ---------- Data API grants (RLS above still decides which rows) ----------

grant usage on schema public to anon, authenticated;
grant select on public.projects, public.skill_groups, public.socials, public.site_settings to anon, authenticated;
grant insert, update, delete on public.projects, public.skill_groups, public.socials, public.site_settings to authenticated;
grant select on public.admins to authenticated;

-- ---------- storage for project screenshots ----------

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update set public = true;

drop policy if exists "admin read project images" on storage.objects;
create policy "admin read project images" on storage.objects
  for select to authenticated
  using (bucket_id = 'project-images'
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

drop policy if exists "admin upload project images" on storage.objects;
create policy "admin upload project images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'project-images'
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

drop policy if exists "admin update project images" on storage.objects;
create policy "admin update project images" on storage.objects
  for update to authenticated
  using (bucket_id = 'project-images'
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid())))
  with check (bucket_id = 'project-images'
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

drop policy if exists "admin delete project images" on storage.objects;
create policy "admin delete project images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'project-images'
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

-- ---------- make the owner the admin ----------
-- Works once the user exists under Authentication > Users.
-- If you create the user later, run just this statement again.
insert into public.admins (user_id)
select id from auth.users where email = '3laaelmasry2005a@gmail.com'
on conflict (user_id) do nothing;
-- Generated by scripts/build-seed.mjs. Run after schema.sql.
-- Rows that already exist are left alone, so this never overwrites dashboard edits.

insert into public.projects (id, sort_order, featured, name, url, domain, category, metric, highlight, tags, one_liner, challenge, what_i_built, result, screenshots) values ('almosaad', 0, true, 'Al Mosaad × EMTOP', 'https://almosad-emtop.com/', 'almosad-emtop.com', '{"en":"Power tools · Sole official importer of EMTOP in Egypt","ar":"عدد كهربائية · المستورد الرسمي الوحيد لـ EMTOP في مصر"}'::jsonb, null, '{"en":"Official EMTOP importer","ar":"المستورد الرسمي الوحيد لـ EMTOP"}'::jsonb, '{"en":["Large Catalog","Arabic RTL Store","B2B/B2C"],"ar":["كتالوج كبير","متجر عربي RTL","B2B/B2C"]}'::jsonb, '{"en":"A huge power-tool catalog, organized so a professional finds the right tool fast.","ar":"كتالوج عدد كبير، متقسم بحيث المحترف يوصل للعدة اللي عايزها بسرعة."}'::jsonb, null, '{"en":"An Arabic-first store for the sole official importer of EMTOP in Egypt. The catalog is split into clear families (cordless, electric, air tools, hand tools, measuring, safety), so browsing feels like walking the aisles of a tool shop. Warranty and cash on delivery are shown up front, because that is what a buyer checks before trusting a new store.","ar":"متجر عربي للمستورد الرسمي الوحيد لـ EMTOP في مصر. الكتالوج متقسم لعائلات واضحة (لاسلكي، كهربائي، هوائي، يدوي، قياس، سلامة)، فالتصفح بقى زي ما تكون ماشي بين رفوف محل عدد. والضمان والدفع عند الاستلام ظاهرين من أول لحظة، لأن دي أول حاجة العميل بيدوّر عليها قبل ما يثق في متجر جديد."}'::jsonb, '{"en":"A catalog this large now reads as simple: pick a category, find the tool, order.","ar":"كتالوج بالحجم ده بقى بسيط: تختار القسم، تلاقي العدة، وتطلب."}'::jsonb, '{"desktop":"almosaad-desktop.webp","mobile":"almosaad-mobile.webp"}'::jsonb) on conflict (id) do nothing;
insert into public.projects (id, sort_order, featured, name, url, domain, category, metric, highlight, tags, one_liner, challenge, what_i_built, result, screenshots) values ('alrajhi', 1, false, 'Alrajhi Industry', 'https://alrajhiindustry.com', 'alrajhiindustry.com', '{"en":"Doors & décor · Saudi Arabia","ar":"أبواب وديكورات · السعودية"}'::jsonb, null, '{"en":"Saudi market · Al Rajhi group","ar":"السوق السعودي · مجموعة الراجحي"}'::jsonb, '{"en":["KSA Store","Arabic RTL","Tabby/Tamara","Quote requests"],"ar":["متجر سعودي","عربي RTL","تابي/تمارا","طلب عروض أسعار"]}'::jsonb, '{"en":"A premium Arabic storefront built around how Saudi customers browse, pay and ask for quotes.","ar":"متجر عربي فخم مبني على طريقة العميل السعودي في التصفح والدفع وطلب الأسعار."}'::jsonb, null, '{"en":"A store for one of the Al Rajhi group companies, specialized in luxury doors, windows and décor. These are considered purchases, so the store sells in two ways: Tabby and Tamara installments for buyers ready to order, and a price-quote request for custom work. The whole experience is Arabic-first and styled like the product itself: calm, spacious, premium.","ar":"متجر لإحدى شركات مجموعة الراجحي، متخصص في الأبواب والشبابيك والديكورات الفاخرة. المنتجات دي قرارها مش سريع، فالمتجر بيبيع بطريقتين: تقسيط تابي وتمارا للي جاهز يطلب، وطلب عرض سعر للشغل المخصوص. والتجربة كلها عربية، هادية وفخمة زي المنتج نفسه."}'::jsonb, '{"en":"A storefront that feels as premium as the doors it sells, with a clear next step for every kind of buyer.","ar":"متجر شكله فخم زي الأبواب اللي بيبيعها، وفيه خطوة واضحة لكل نوع عميل."}'::jsonb, '{"desktop":"alrajhi-desktop.webp","mobile":"alrajhi-mobile.webp"}'::jsonb) on conflict (id) do nothing;
insert into public.projects (id, sort_order, featured, name, url, domain, category, metric, highlight, tags, one_liner, challenge, what_i_built, result, screenshots) values ('rull', 2, false, 'Rull Clothes', 'https://www.rullclothes.com/products/premium-essential-tee-38', 'rullclothes.com', '{"en":"Egyptian clothing brand · Fashion","ar":"براند ملابس مصري · موضة"}'::jsonb, '{"value":"×5","label":{"en":"Sales","ar":"المبيعات"}}'::jsonb, null, '{"en":["Redesign","Sales Funnel","CRO","Trust System"],"ar":["ريديزاين","فانل مبيعات","CRO","نظام ثقة"]}'::jsonb, '{"en":"A trust-first redesign that turned visitors into buyers and grew sales 5x.","ar":"ريديزاين مبني على الثقة، حوّل الزوار لمشترين وضاعف المبيعات 5 أضعاف."}'::jsonb, '{"en":"The traffic was there, the sales were not. Visitors landed, looked around and left, because the old store gave them no reason to trust a brand they had just met.","ar":"الزيارات موجودة بس المبيعات لأ. الزائر كان بيدخل يتفرج ويمشي، لأن المتجر القديم ما كانش مديله سبب يثق في براند لسه شايفه لأول مرة."}'::jsonb, '{"en":"A full redesign and a funnel where every step answers a doubt. A clear product page with a size guide, so no one guesses their size. Shipping and the 14-day return policy in plain sight. A free-shipping threshold and related products to lift the order. A direct WhatsApp line for anyone who still has a question.","ar":"ريديزاين كامل وفانل كل خطوة فيها بترد على شك عند العميل. صفحة منتج واضحة فيها دليل مقاسات، فمحدش يخمّن مقاسه. سياسة الشحن والاسترجاع خلال 14 يوم ظاهرة قدامه. حد للشحن المجاني ومنتجات مقترحة تكبّر الأوردر. وخط واتساب مباشر للي لسه عنده سؤال."}'::jsonb, '{"en":"Sales grew 5x and the brand held its place in a crowded market, with far more visits ending in an order.","ar":"المبيعات زادت 5 أضعاف والبراند ثبّت مكانه في سوق زحمة، وزيارات أكتر بكتير بقت بتخلص بأوردر."}'::jsonb, '{"desktop":"rull-home-desktop.webp","mobile":"rull-home-mobile.webp","desktopSecondary":"rull-product-desktop.webp","mobileSecondary":"rull-product-mobile.webp"}'::jsonb) on conflict (id) do nothing;
insert into public.projects (id, sort_order, featured, name, url, domain, category, metric, highlight, tags, one_liner, challenge, what_i_built, result, screenshots) values ('naila', 3, false, 'Naila', 'https://naila-eg.com', 'naila-eg.com', '{"en":"Egyptian womenswear brand · Fashion","ar":"براند ملابس حريمي مصري · موضة"}'::jsonb, '{"value":"< 3 days","label":{"en":"Full store delivery","ar":"بناء متجر كامل"}}'::jsonb, null, '{"en":["Full Store Build","Fast Launch"],"ar":["بناء متجر كامل","إطلاق سريع"]}'::jsonb, '{"en":"From nothing to a live, elegant store in under 3 days.","ar":"من الصفر لمتجر أنيق شغال في أقل من 3 أيام."}'::jsonb, '{"en":"The owner wanted to start selling right away. There was no room for a build that drags on for weeks.","ar":"المالك كان عايز يبدأ يبيع فورًا، ومفيش وقت لبناء يقعد أسابيع."}'::jsonb, '{"en":"A complete store, not a rushed placeholder: collections, a best-sellers section, video product showcases and seasonal campaign sections, taken from zero to live.","ar":"متجر كامل مش نسخة مستعجلة: كوليكشنز، سكشن الأكتر مبيعًا، عرض المنتجات بالفيديو، وسكشنز لحملات الموسم، من الصفر لحد ما اشتغل."}'::jsonb, '{"en":"Fully live in under 3 days, ready for its first orders.","ar":"اشتغل بالكامل في أقل من 3 أيام، وجاهز يستقبل أوردرات."}'::jsonb, '{"desktop":"naila-desktop.webp","mobile":"naila-mobile.webp"}'::jsonb) on conflict (id) do nothing;
insert into public.projects (id, sort_order, featured, name, url, domain, category, metric, highlight, tags, one_liner, challenge, what_i_built, result, screenshots) values ('fakhmestaa', 4, false, 'Fakhmestaa', 'https://fakhmestaa.com/', 'fakhmestaa.com', '{"en":"Egyptian footwear brand · Sneakers & accessories","ar":"براند أحذية مصري · سنيكرز وإكسسوارات"}'::jsonb, '{"value":"1000+","label":{"en":"Orders in < 3 months","ar":"أوردر في أقل من 3 شهور"}}'::jsonb, null, '{"en":["Store Build","Sales Funnel","Mass-market targeting"],"ar":["بناء متجر","فانل مبيعات","استهداف شعبي"]}'::jsonb, '{"en":"A funnel that talks the way its customers talk: 1000+ orders in under 3 months.","ar":"فانل بتكلم العميل بلغته: +1000 أوردر في أقل من 3 شهور."}'::jsonb, '{"en":"The audience is broad and mass-market. These customers buy with confidence only when the store feels familiar and simple.","ar":"الجمهور واسع وشعبي، وبيشتري بثقة بس لما المتجر يبقى بسيط ومألوف ليه."}'::jsonb, '{"en":"A full funnel written and designed in the customer’s own language. Offers and discounts you understand at a glance. Order confirmation on WhatsApp, where they already are. InstaPay as a local way to pay. Fast-delivery messaging at every step.","ar":"فانل كاملة مكتوبة ومتصممة بلغة العميل نفسه. عروض وخصومات تتفهم من أول نظرة. تأكيد الأوردر على واتساب، المكان اللي هو فيه أصلًا. دفع بـ InstaPay. ورسايل التوصيل السريع في كل خطوة."}'::jsonb, '{"en":"1000+ orders in under 3 months.","ar":"أكتر من 1000 أوردر في أقل من 3 شهور."}'::jsonb, '{"desktop":"fakhmestaa-desktop.webp","mobile":"fakhmestaa-mobile.webp"}'::jsonb) on conflict (id) do nothing;

insert into public.skill_groups (id, sort_order, label, items) values ('shopify', 0, '{"en":"Shopify","ar":"Shopify"}'::jsonb, '["Liquid","Online Store 2.0","Theme Development","CRO","Sales Funnels","Store Setup & Launch"]'::jsonb) on conflict (id) do nothing;
insert into public.skill_groups (id, sort_order, label, items) values ('frontend', 1, '{"en":"Front-end","ar":"Front-end"}'::jsonb, '["HTML","CSS","JavaScript","Responsive UI"]'::jsonb) on conflict (id) do nothing;
insert into public.skill_groups (id, sort_order, label, items) values ('backend', 2, '{"en":"Back-end","ar":"Back-end"}'::jsonb, '["C#","ASP.NET Core (Web API & MVC)","Entity Framework Core","REST APIs","JWT Auth","Role-Based Authorization"]'::jsonb) on conflict (id) do nothing;
insert into public.skill_groups (id, sort_order, label, items) values ('databases', 3, '{"en":"Databases","ar":"قواعد البيانات"}'::jsonb, '["SQL Server","Query Optimization","Stored Procedures","Indexing"]'::jsonb) on conflict (id) do nothing;
insert into public.skill_groups (id, sort_order, label, items) values ('engineering', 4, '{"en":"Engineering","ar":"هندسة برمجيات"}'::jsonb, '["OOP","SOLID","Clean / N-Tier Architecture","Dependency Injection","Repository & Unit of Work","DSA","C++","xUnit / NUnit"]'::jsonb) on conflict (id) do nothing;
insert into public.skill_groups (id, sort_order, label, items) values ('tools', 5, '{"en":"Tools","ar":"أدوات"}'::jsonb, '["Git","GitHub","Postman","Swagger","Visual Studio"]'::jsonb) on conflict (id) do nothing;

insert into public.socials (id, sort_order, label, url, icon) values ('instagram', 0, 'Instagram', 'https://www.instagram.com/3laa_elmasry0', 'instagram') on conflict (id) do nothing;
insert into public.socials (id, sort_order, label, url, icon) values ('tiktok', 1, 'TikTok', 'https://www.tiktok.com/@elmasryshopify', 'tiktok') on conflict (id) do nothing;
insert into public.socials (id, sort_order, label, url, icon) values ('facebook', 2, 'Facebook', 'https://www.facebook.com/laalmsry.427007', 'facebook') on conflict (id) do nothing;
insert into public.socials (id, sort_order, label, url, icon) values ('linkedin', 3, 'LinkedIn', 'https://www.linkedin.com/in/alaaelmasry', 'linkedin') on conflict (id) do nothing;
insert into public.socials (id, sort_order, label, url, icon) values ('github', 4, 'GitHub', 'https://github.com/3laaElmasry', 'github') on conflict (id) do nothing;

insert into public.site_settings (key, value) values ('contact', '{"phone":"+20 108 085 0238","whatsappNumber":"201080850238","email":"3laaelmasry2005a@gmail.com","whatsappMessage":{"en":"Hi Alaa, I saw your portfolio and I''d like to talk about a Shopify project","ar":"أهلاً علاء، شفت البورتفوليو بتاعك وعايز أتكلم معاك عن مشروع Shopify"}}'::jsonb) on conflict (key) do nothing;

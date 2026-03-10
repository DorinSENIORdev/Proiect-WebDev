import { getPool, sql } from "../src/db.js";

const GRAPHQL_URL = "https://999.md/graphql";
const IMAGE_BASE_URL = "https://i.simpalsmedia.com/999.md/BoardImages/900x900/";
const TARGET_USER_NAME = "Dorin Betivu";

const CATEGORY_MAP = [
  { localCategory: "Auto & Moto", mdCategoryId: 658 },
  { localCategory: "Imobiliare", mdCategoryId: 270 },
  { localCategory: "Electronice", mdCategoryId: 38 },
  { localCategory: "Casa & Gradina", mdCategoryId: 1170 },
  { localCategory: "Moda", mdCategoryId: 1213 },
  { localCategory: "Sport & Hobby", mdCategoryId: 1155 },
  { localCategory: "Copii", mdCategoryId: 1412 },
  { localCategory: "Animale", mdCategoryId: 226 },
];

async function gql(query, variables = {}) {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`999 GraphQL HTTP ${response.status}`);
  }

  const payload = await response.json();
  if (payload.errors?.length) {
    throw new Error(`999 GraphQL error: ${JSON.stringify(payload.errors[0])}`);
  }

  return payload.data;
}

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function imageUrlsFromFeature(feature) {
  if (!feature || feature.type !== "FEATURE_IMAGES" || !Array.isArray(feature.value)) {
    return [];
  }

  return feature.value
    .filter((filename) => typeof filename === "string" && filename.trim().length > 0)
    .map((filename) => `${IMAGE_BASE_URL}${filename}`);
}

async function fetchSubCategoryIds(mdCategoryId) {
  const data = await gql(
    `
    query ($input: GetCategoryRequestInput!) {
      category(input: $input) {
        categories {
          id
        }
      }
    }
    `,
    {
      input: { id: mdCategoryId },
    }
  );

  return (data?.category?.categories ?? []).map((category) => category.id).filter(Boolean);
}

async function fetchSearchAdsBySubCategory(subCategoryId, skip) {
  const data = await gql(
    `
    query ($input: Ads_SearchInput) {
      searchAds(input: $input) {
        ads {
          id
          feature(id: 14) {
            id
            type
            value
          }
        }
      }
    }
    `,
    {
      input: {
        subCategoryId,
        pagination: {
          limit: 30,
          skip,
        },
      },
    }
  );

  return data?.searchAds?.ads ?? [];
}

async function fetchInfiniteAdsByCategory(mdCategoryId, skip) {
  const data = await gql(
    `
    query ($input: Ads_InfinitScrollInput) {
      infiniteScrollAds(input: $input) {
        ads {
          id
          feature(id: 14) {
            id
            type
            value
          }
        }
      }
    }
    `,
    {
      input: {
        limit: 40,
        skip,
        categoryId: mdCategoryId,
      },
    }
  );

  return data?.infiniteScrollAds?.ads ?? [];
}

async function fetchCategoryImageUrls(mdCategoryId, minimumCount = 10) {
  const imageSet = new Set();
  const usedAdIds = new Set();

  const addFromAds = (ads) => {
    for (const ad of ads) {
      if (!ad?.id || usedAdIds.has(ad.id)) {
        continue;
      }

      const urls = imageUrlsFromFeature(ad.feature);
      if (urls.length === 0) {
        continue;
      }

      usedAdIds.add(ad.id);
      const pick = urls[Math.floor(Math.random() * urls.length)];
      imageSet.add(pick);
    }
  };

  // 1) Prefer subcategories for better visual diversity.
  const subCategoryIds = shuffle(await fetchSubCategoryIds(mdCategoryId));
  for (const subCategoryId of subCategoryIds.slice(0, 10)) {
    for (let skip = 0; skip <= 120 && imageSet.size < minimumCount; skip += 30) {
      const ads = await fetchSearchAdsBySubCategory(subCategoryId, skip);
      if (ads.length === 0) {
        break;
      }
      addFromAds(ads);
    }
    if (imageSet.size >= minimumCount) {
      break;
    }
  }

  // 2) Fallback with category infinite scroll.
  for (let skip = 0; skip <= 320 && imageSet.size < minimumCount; skip += 40) {
    const ads = await fetchInfiniteAdsByCategory(mdCategoryId, skip);
    if (ads.length === 0) {
      break;
    }
    addFromAds(ads);
  }

  return shuffle(Array.from(imageSet));
}

async function getTargetUserId(pool) {
  const result = await pool
    .request()
    .input("name", sql.NVarChar(120), TARGET_USER_NAME)
    .query(`
      SELECT TOP 1 id
      FROM dbo.Users
      WHERE name = @name
      ORDER BY id;
    `);

  return result.recordset[0]?.id ?? null;
}

async function getAnnouncementIds(pool, userId, category) {
  const result = await pool
    .request()
    .input("userId", sql.Int, userId)
    .input("category", sql.NVarChar(120), category)
    .query(`
      SELECT id
      FROM dbo.Announcements
      WHERE userId = @userId
        AND category = @category
      ORDER BY id;
    `);

  return result.recordset.map((row) => row.id);
}

async function updateAnnouncementImage(pool, announcementId, imageUrl) {
  await pool
    .request()
    .input("id", sql.Int, announcementId)
    .input("imageUrl", sql.NVarChar(sql.MAX), imageUrl)
    .query(`
      UPDATE dbo.Announcements
      SET imageUrl = @imageUrl
      WHERE id = @id;
    `);
}

async function main() {
  const pool = await getPool();
  const userId = await getTargetUserId(pool);

  if (!userId) {
    throw new Error(`User "${TARGET_USER_NAME}" nu exista in dbo.Users.`);
  }

  const summary = [];

  for (const { localCategory, mdCategoryId } of CATEGORY_MAP) {
    const announcementIds = await getAnnouncementIds(pool, userId, localCategory);
    if (announcementIds.length === 0) {
      summary.push(`${localCategory}: 0 anunturi locale`);
      continue;
    }

    const imageUrls = await fetchCategoryImageUrls(mdCategoryId, 20);
    if (imageUrls.length === 0) {
      summary.push(`${localCategory}: 0 imagini gasite pe 999`);
      continue;
    }

    for (let index = 0; index < announcementIds.length; index += 1) {
      const announcementId = announcementIds[index];
      const imageUrl = imageUrls[index % imageUrls.length];
      await updateAnnouncementImage(pool, announcementId, imageUrl);
    }

    summary.push(
      `${localCategory}: ${announcementIds.length} anunturi actualizate cu ${imageUrls.length} imagini 999`
    );
  }

  console.log("Seed completed for", TARGET_USER_NAME);
  for (const line of summary) {
    console.log("-", line);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

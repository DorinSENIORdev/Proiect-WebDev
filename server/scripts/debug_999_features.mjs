const GRAPHQL_URL = "https://999.md/graphql";

async function gql(query) {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  if (data.errors) {
    throw new Error(JSON.stringify(data.errors, null, 2));
  }
  return data.data;
}

function buildFeatureSelection(maxId) {
  const fields = [];
  for (let id = 1; id <= maxId; id += 1) {
    fields.push(`f${id}: feature(id: ${id}) { id type value }`);
  }
  return fields.join("\n");
}

async function main() {
  const list = await gql(`
    query {
      searchAds(input: { pagination: { limit: 1, skip: 0 } }) {
        ads {
          id
          title
        }
      }
    }
  `);

  const ad = list.searchAds.ads[0];
  if (!ad) {
    console.log("No ad found in searchAds.");
    return;
  }

  const featureSelection = buildFeatureSelection(250);
  const details = await gql(`
    query {
      advert(input: { id: "${ad.id}" }) {
        id
        title
        ${featureSelection}
      }
    }
  `);

  const advert = details.advert;
  const nonNullFeatures = [];
  const imageFeatures = [];

  for (const [key, value] of Object.entries(advert)) {
    if (!/^f\d+$/.test(key) || value == null) {
      continue;
    }
    nonNullFeatures.push({ key, id: value.id, type: value.type });
    if (value.type === "FEATURE_IMAGES") {
      imageFeatures.push({ key, id: value.id, value: value.value });
    }
  }

  console.log("Ad:", ad.id, ad.title);
  console.log("Non-null features:", nonNullFeatures.length);
  console.log("Feature types:", [...new Set(nonNullFeatures.map((f) => f.type))]);
  console.log("Image features:", JSON.stringify(imageFeatures, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

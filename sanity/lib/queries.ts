import { defineQuery } from "next-sanity";

export const ALL_PROJECTS_QUERY = defineQuery(`*[_type == "project"] | order(pos asc) {
  _id,
  id,
  title,
  "slug": slug.current,
  category,
  image,
  pos,
  description,
  year
}`);

export const PROJECT_BY_SLUG_QUERY = defineQuery(`*[_type == "project" && slug.current == $slug][0] {
  _id,
  id,
  title,
  "slug": slug.current,
  category,
  image,
  pos,
  description,
  year
}`);

export const ALL_CATEGORIES_QUERY = defineQuery(`*[_type == "category"] | order(id asc) {
  _id,
  id,
  title,
  description,
  image
}`);

export const CATEGORY_BY_ID_QUERY = defineQuery(`*[_type == "category" && id == $id][0] {
  _id,
  id,
  title,
  description,
  image
}`);

export const PROJECTS_BY_CATEGORY_QUERY = defineQuery(`*[_type == "project" && category == $categoryId] | order(pos asc) {
  _id,
  id,
  title,
  "slug": slug.current,
  category,
  image,
  pos,
  description,
  year
}`);

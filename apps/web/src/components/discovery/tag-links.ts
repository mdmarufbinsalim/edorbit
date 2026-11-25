import { tagParam } from "@edorbit/core";

/** Link to the discovery page filtered by these tags. */
export const tagHref = (tags: readonly string[]) =>
  tags.length ? `/?tags=${encodeURIComponent(tagParam(tags))}#concepts` : "/#concepts";

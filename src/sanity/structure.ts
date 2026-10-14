import type { StructureBuilder, StructureResolver } from "sanity/structure";
import { BottleIcon } from "@sanity/icons/Bottle";
import { IceCreamIcon } from "@sanity/icons/IceCream";
import { ImageIcon } from "@sanity/icons/Image";
import { LemonIcon } from "@sanity/icons/Lemon";

function dishList(
  S: StructureBuilder,
  title: string,
  section: string,
  templateId: string,
) {
  return S.listItem()
    .title(title)
    .icon(LemonIcon)
    .schemaType("dish")
    .child(
      S.documentTypeList("dish")
        .title(title)
        .filter('_type == "dish" && section == $section')
        .params({ section })
        .initialValueTemplates([S.initialValueTemplateItem(templateId)])
        .defaultOrdering([{ field: "order", direction: "asc" }]),
    );
}

function wineList(
  S: StructureBuilder,
  title: string,
  section: string,
  templateId: string,
) {
  return S.listItem()
    .title(title)
    .icon(BottleIcon)
    .schemaType("wine")
    .child(
      S.documentTypeList("wine")
        .title(title)
        .filter('_type == "wine" && section == $section')
        .params({ section })
        .initialValueTemplates([S.initialValueTemplateItem(templateId)])
        .defaultOrdering([{ field: "order", direction: "asc" }]),
    );
}

function pourList(
  S: StructureBuilder,
  title: string,
  section: string,
  templateId: string,
) {
  return S.listItem()
    .title(title)
    .icon(IceCreamIcon)
    .schemaType("pour")
    .child(
      S.documentTypeList("pour")
        .title(title)
        .filter('_type == "pour" && section == $section')
        .params({ section })
        .initialValueTemplates([S.initialValueTemplateItem(templateId)])
        .defaultOrdering([{ field: "order", direction: "asc" }]),
    );
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Edit the website")
    .items([
      S.listItem()
        .title("Food menu")
        .icon(LemonIcon)
        .child(
          S.list()
            .title("Food menu")
            .items([
              dishList(S, "Small plates", "smallPlates", "dish-smallPlates"),
              dishList(S, "Red pies", "redPies", "dish-redPies"),
              dishList(S, "White pies", "whitePies", "dish-whitePies"),
              dishList(S, "Dolci", "desserts", "dish-desserts"),
            ]),
        ),
      S.listItem()
        .title("Wine & drinks")
        .icon(BottleIcon)
        .child(
          S.list()
            .title("Wine & drinks")
            .items([
              wineList(S, "Sparkling", "sparkling", "wine-sparkling"),
              wineList(S, "White & orange", "white", "wine-white"),
              wineList(S, "Red", "red", "wine-red"),
              wineList(S, "Sweet", "sweet", "wine-sweet"),
              S.divider(),
              pourList(S, "Cocktails", "cocktails", "pour-cocktails"),
              pourList(S, "Beer", "beers", "pour-beers"),
            ]),
        ),
      S.listItem()
        .title("Homepage photos")
        .icon(ImageIcon)
        .schemaType("photo")
        .child(
          S.documentTypeList("photo")
            .title("Homepage photos")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),
      S.listItem()
        .title("Our story")
        .icon(ImageIcon)
        .id("story")
        .child(
          S.document().schemaType("story").documentId("story").title("Our story"),
        ),
    ]);

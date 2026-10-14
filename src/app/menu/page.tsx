import type { Metadata } from "next";
import { DashedRule } from "@/components/DashedRule";
import { MenuRow } from "@/components/MenuRow";
import { Sheet } from "@/components/Sheet";
import { restaurant } from "@/content/site";
import { allergyNote, getMenu } from "@/lib/cms";

export const metadata: Metadata = {
  title: "menu",
  description:
    "Small plates, 14-inch sourdough pies, and dolci at Favorite Son. Whole pies, six slices. Dine-in on Forest Avenue.",
};

export default async function MenuPage() {
  const menu = await getMenu();

  return (
    <Sheet title="menu">
      <p className="section-note">{`${restaurant.notice.title}. ${restaurant.notice.body}`}</p>
      {menu.empty ? (
        <p className="empty-copy">the board is blank tonight. ask the floor.</p>
      ) : (
        <>
          <h2 className="section-title">small plates</h2>
          <div className="menu-list">
            {menu.smallPlates.length === 0 ? (
              <p className="empty-copy">no small plates listed.</p>
            ) : (
              menu.smallPlates.map((dish) => (
                <MenuRow key={dish.name} {...dish} />
              ))
            )}
          </div>
          <DashedRule />
          <h2 className="section-title">
            sourdough pizza <span className="title-note">– 14 inch – 6 slices</span>
          </h2>
          <div className="pie-columns">
            <section>
              <h3 className="column-label">red</h3>
              {menu.redPies.length === 0 ? (
                <p className="empty-copy">no red pies listed.</p>
              ) : (
                menu.redPies.map((dish) => (
                  <MenuRow key={dish.name} {...dish} />
                ))
              )}
            </section>
            <section>
              <h3 className="column-label">white</h3>
              {menu.whitePies.length === 0 ? (
                <p className="empty-copy">no white pies listed.</p>
              ) : (
                menu.whitePies.map((dish) => (
                  <MenuRow key={dish.name} {...dish} />
                ))
              )}
            </section>
          </div>
          <DashedRule />
          <h2 className="section-title">dolci — all $9</h2>
          <div className="menu-list">
            {menu.desserts.length === 0 ? (
              <p className="empty-copy">no dolci listed.</p>
            ) : (
              menu.desserts.map((dish) => (
                <MenuRow key={dish.name} {...dish} />
              ))
            )}
          </div>
          <p className="allergy">*{allergyNote}</p>
        </>
      )}
    </Sheet>
  );
}

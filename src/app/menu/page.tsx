import type { Metadata } from "next";
import { DashedRule } from "@/components/DashedRule";
import { MenuJumps } from "@/components/MenuJumps";
import { MenuRow } from "@/components/MenuRow";
import { Reveal } from "@/components/Reveal";
import { Sheet } from "@/components/Sheet";
import { WineRow } from "@/components/WineRow";
import type { Wine } from "@/content/menu";
import { restaurant } from "@/content/site";
import { allergyNote, getDrinks, getMenu } from "@/lib/cms";

export const metadata: Metadata = {
  title: "menu",
  description:
    "Small plates, 14-inch sourdough pies, dolci, natural wine, cocktails, and beer at Favorite Son. Whole pies, six slices. Dine-in on Forest Avenue.",
};

function WineBlock({ title, wines }: { title: string; wines: Wine[] }) {
  return (
    <section>
      <h3 className="section-title">{title}</h3>
      {wines.length === 0 ? (
        <p className="empty-copy">nothing listed.</p>
      ) : (
        wines.map((wine) => <WineRow key={wine.name} {...wine} />)
      )}
    </section>
  );
}

export default async function MenuPage() {
  const [menu, drinks] = await Promise.all([getMenu(), getDrinks()]);

  return (
    <Sheet title="menu">
      <MenuJumps />
      <section id="food" className="menu-part">
        <p className="section-note">{`${restaurant.notice.title}. ${restaurant.notice.body}`}</p>
        {menu.empty ? (
          <p className="empty-copy">the board is blank tonight. ask the floor.</p>
        ) : (
          <>
            <Reveal>
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
            </Reveal>
            <DashedRule />
            <Reveal delay={1}>
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
            </Reveal>
            <DashedRule />
            <Reveal delay={2}>
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
            </Reveal>
          </>
        )}
      </section>
      <DashedRule />
      <section id="drinks" className="menu-part">
        {drinks.empty ? (
          <>
            <h2 className="section-title">wine & drinks</h2>
            <p className="empty-copy">the list is blank tonight. ask the floor.</p>
          </>
        ) : (
          <>
            <Reveal>
              <h2 className="section-title">wine & drinks</h2>
              <p className="price-key">glass / bottle</p>
              <div className="wine-board">
                <div>
                  <WineBlock title="sparkling" wines={drinks.sparkling} />
                  <WineBlock title="white & orange" wines={drinks.whiteWines} />
                </div>
                <div>
                  <WineBlock title="red" wines={drinks.redWines} />
                  <WineBlock title="sweet" wines={drinks.sweetWines} />
                </div>
              </div>
            </Reveal>
            <DashedRule />
            <Reveal delay={1}>
              <h3 className="section-title">cocktails — $16</h3>
              <div className="menu-list">
                {drinks.cocktails.length === 0 ? (
                  <p className="empty-copy">no cocktails listed.</p>
                ) : (
                  drinks.cocktails.map((drink) => (
                    <MenuRow key={drink.name} {...drink} />
                  ))
                )}
              </div>
            </Reveal>
            <DashedRule />
            <Reveal delay={2}>
              <h3 className="section-title">beers</h3>
              <div className="menu-list">
                {drinks.beers.length === 0 ? (
                  <p className="empty-copy">no beers listed.</p>
                ) : (
                  drinks.beers.map((beer) => (
                    <MenuRow
                      key={beer.name}
                      name={beer.name}
                      detail={beer.detail || undefined}
                      price={beer.price}
                      status={beer.status}
                    />
                  ))
                )}
              </div>
            </Reveal>
          </>
        )}
      </section>
    </Sheet>
  );
}

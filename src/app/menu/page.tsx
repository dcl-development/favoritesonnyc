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
  if (wines.length === 0) return null;
  return (
    <section>
      <h3 className="section-title">{title}</h3>
      {wines.map((wine) => (
        <WineRow key={wine.name} {...wine} />
      ))}
    </section>
  );
}

export default async function MenuPage() {
  const [menu, drinks] = await Promise.all([getMenu(), getDrinks()]);

  const hasSmallPlates = menu.smallPlates.length > 0;
  const hasRedPies = menu.redPies.length > 0;
  const hasWhitePies = menu.whitePies.length > 0;
  const hasPies = hasRedPies || hasWhitePies;
  const hasDolci = menu.desserts.length > 0;
  const hasFood = hasSmallPlates || hasPies || hasDolci;

  const hasWines =
    drinks.sparkling.length > 0 ||
    drinks.whiteWines.length > 0 ||
    drinks.redWines.length > 0 ||
    drinks.sweetWines.length > 0;
  const hasCocktails = drinks.cocktails.length > 0;
  const hasBeers = drinks.beers.length > 0;

  return (
    <Sheet title="menu">
      <MenuJumps />
      <section id="food" className="menu-part">
        <p className="section-note">{`${restaurant.notice.title}. ${restaurant.notice.body}`}</p>
        {menu.empty ? (
          <p className="empty-copy">the board is blank tonight. ask the floor.</p>
        ) : !hasFood ? (
          <p className="empty-copy">nothing on the board right now. ask the floor.</p>
        ) : (
          <>
            {hasSmallPlates ? (
              <Reveal>
                <h2 className="section-title">small plates</h2>
                <div className="menu-list">
                  {menu.smallPlates.map((dish) => (
                    <MenuRow key={dish.name} {...dish} />
                  ))}
                </div>
              </Reveal>
            ) : null}
            {hasSmallPlates && hasPies ? <DashedRule /> : null}
            {hasPies ? (
              <Reveal delay={1}>
                <h2 className="section-title">
                  sourdough pizza <span className="title-note">– 14 inch – 6 slices</span>
                </h2>
                <div className="pie-columns">
                  {hasRedPies ? (
                    <section>
                      <h3 className="column-label">red</h3>
                      {menu.redPies.map((dish) => (
                        <MenuRow key={dish.name} {...dish} />
                      ))}
                    </section>
                  ) : null}
                  {hasWhitePies ? (
                    <section>
                      <h3 className="column-label">white</h3>
                      {menu.whitePies.map((dish) => (
                        <MenuRow key={dish.name} {...dish} />
                      ))}
                    </section>
                  ) : null}
                </div>
              </Reveal>
            ) : null}
            {(hasSmallPlates || hasPies) && hasDolci ? <DashedRule /> : null}
            {hasDolci ? (
              <Reveal delay={2}>
                <h2 className="section-title">dolci — all $9</h2>
                <div className="menu-list">
                  {menu.desserts.map((dish) => (
                    <MenuRow key={dish.name} {...dish} />
                  ))}
                </div>
                <p className="allergy">*{allergyNote}</p>
              </Reveal>
            ) : null}
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
        ) : !hasWines && !hasCocktails && !hasBeers ? (
          <>
            <h2 className="section-title">wine & drinks</h2>
            <p className="empty-copy">nothing on the list right now. ask the floor.</p>
          </>
        ) : (
          <>
            <Reveal>
              <h2 className="section-title">wine & drinks</h2>
              {hasWines ? (
                <>
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
                </>
              ) : null}
            </Reveal>
            {hasWines && hasCocktails ? <DashedRule /> : null}
            {hasCocktails ? (
              <Reveal delay={1}>
                <h3 className="section-title">cocktails — $16</h3>
                <div className="menu-list">
                  {drinks.cocktails.map((drink) => (
                    <MenuRow key={drink.name} {...drink} />
                  ))}
                </div>
              </Reveal>
            ) : null}
            {(hasWines || hasCocktails) && hasBeers ? <DashedRule /> : null}
            {hasBeers ? (
              <Reveal delay={2}>
                <h3 className="section-title">beers</h3>
                <div className="menu-list">
                  {drinks.beers.map((beer) => (
                    <MenuRow key={beer.name} {...beer} />
                  ))}
                </div>
              </Reveal>
            ) : null}
          </>
        )}
      </section>
    </Sheet>
  );
}

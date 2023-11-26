This is the source for [Manifold Search](https://outsidetheasylum.blog/manifold-search/), an advanced search function and trading dashboard for [Manifold Markets](https://manifold.markets/?r=SXNhYWNLaW5n). For a description of its existing features, please read [the documentation](https://outsidetheasylum.blog/manifold-search/documentation.html). For a list of planned features and known bugs, see [this market](https://manifold.markets/IsaacKing/what-changes-will-i-make-to-my-mani).

Contributions are welcome; feel free to submit a pull request. By doing so, you grant me a permanent, irrevocable license to use your code for any purpose I choose, as though I had written it myself. You retain the right to use your code for your own purposes as well, as though it had been independently written by both parties. In the event that Manifold grants any money to this project as a part of their [Community Fund](https://manifund.org/causes/manifold-community?tab=about), I will split that money among all contributers in approximate proportion to their contribution.

To run a local copy, download all files, install the requisite npm packages, and then `pm2 start ecosystem.config.js` in the top level directory. (Or just `node server.js`/`node maintainMarketData.js`.) It will take a few hours to build the market database, but you'll be able to use the search right away to search the markets that have been downloaded so far.

Please reach out to me on [Discord](https://discordapp.com/users/163751683837526016/), [Manifold](https://manifold.markets/IsaacKing), or [some other way](https://outsidetheasylum.blog/#contact) if you have any questions. I have very little experience with multi-person software development, so please don't hestitate to send advice and suggestions my way.

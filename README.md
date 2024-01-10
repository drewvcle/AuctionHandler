# AuctionHandler
Source code of Auction Handler Bot.

This Discord Bot is used by thousands of members in a community I cherish. It serves as an addition to an already existing bot used by a community totaling over 500 thousand players.
This purpose of this program is to support the current hard-working handlers as well as adding a couple quality of life and fun features for the community.

Functions:
1. Private: automatic timer that serves to ping specific auction handlers when an auction ends.
2. Private: !timers command which is used to display the current auction channels that are done/ongoing.
3. Private: Auction handlers are automatically pinged when next in auction queue.
4. Public: !auction command which is used to display current ongoing auctions and the item that is auctioned.
5. Public: !lb command which is used to display a leaderboards consisting the top 50 players who won the most bids.
6. Public: !ca command which when used, runs a sophisticated ticket system for the user to submit an auction.

Update 3.0:
Addition of the !ca command. This command can be used in the official server or the bot's direct messages. When ran, a channel will be created in the official server. Only the administrator, moderators, and the user who created the ticket will be able to access this channel. In this channel, the user will be able to
interact with a user interface to set up their auction. When completed, the channel will be deleted and required informatiom will be sent to a hidden channel, which after extensive checks and verification by the handlers, will be put into the auction queue.


These additions are proudly presented by GJuice51 and I. Keep in mind that this program will not operate without filling in blank channel and user IDs, and a private Google Spreadsheet key. Additionally, multiple dependencies are required, such as npm node and npm google-spreadsheet. For contact purposes please email andrewvcle@icloud.com or aguaseous on Discord for additional information. For GJuice51's contact information, please visit GJuice51's GitHub page through https://github.com/GJuice51 or DM him on Discord through gjuice51_.

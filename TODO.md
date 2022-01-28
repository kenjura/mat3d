
# Feature Roadmap

Priority list:
- Multiplayer
- Token creation
- Map management
- Campaigns
- Actions



# Feature List

## Multiplayer

oh boy.


## Overlay UI

Main elements:
- Main nav
  - Save campaign
  - New / edit / delete / select map
  - Preferences
  - etc
- Team view
  - Shows status of self and any teammates, allows quick selection and camera movement
  - Each player can control any number of tokens. Allow drag-and-drop to determine which is the primary token.
    - Minion tokens owned by current player are shown differently than teammates' primary/secondary tokens.
- Chat
- Actions
  - Actions available for self or currently impersonated/selected token
  - Obvious UI queue for impersonate/selected actions vs self
  - May have global/campaign actions in this space
- Contextual Help
- Edit Mode (DM)
  - Draw on map
  - VBL
  - etc
- Layer selection
  - Token / object / background


Use cases:
- Add a token
  - Drag any image from any other window, drop on map
    - Alternatively, context click on map, select Add Token, then select Browse or Drag
  - Instantly create token, object, or background image based on layer selection
  - Context menu: change to token, object, or background image
  - Assume player who dropped the token controls it. 
    - If no primary token, this becomes primary
    - Else, this becomes a secondary token

Things not in MapTool:
- Campaign Tokens
  - Essentially a first-class Token Repository
  - Every object is a token, but has master properties
  - Properties are key-value pairs, with eval capability and a few QoL features for things like advantage, floor, etc
  - Future feature: URL to get data from external source on campaign load (with refresh button, maybe polling)
- Actions
  - Basically macros, written as JS functions.
    - Input: { currentToken, currentMap, targetToken, allTokens, etc... }
    - Output: what goes into chat
    - Future feature: special language in chat that creates a button, e.g. "causes 56 damage to Token #3" which DM can press to actually cause that damage
- File Management
  - In Electron app, use native OS filesystem
  - Otherwise, can save/load from Dropbox via API, others TBI
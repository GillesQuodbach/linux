-- disable netrw
vim.g.loaded_netrw = 1
vim.g.loaded_netrwPlugin = 1

-- enable 24-bits colour
vim.opt.termguicolors = true

-- config
require('config.options')
require('config.keybinds')
require('config.lazy')

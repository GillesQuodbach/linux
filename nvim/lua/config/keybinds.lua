vim.keymap.set("n", "<leader>cd", vim.cmd.Ex, { desc = "Open Netrw", silent = true, noremap = true })
vim.api.nvim_set_keymap("n", "<C-h>", ":NvimTreeToggle<CR>", { silent = true, noremap = true })

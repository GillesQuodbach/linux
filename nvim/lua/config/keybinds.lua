vim.keymap.set("n", "<leader>cd", vim.cmd.Ex, { desc = "Open Netrw", silent = true, noremap = true })
vim.api.nvim_set_keymap("n", "<C-h>", ":NvimTreeToggle<CR>", { silent = true, noremap = true })
vim.keymap.set("n", "<leader>cd", vim.cmd.Ex, { desc = "Open Netrw", silent = true, noremap = true })
vim.api.nvim_set_keymap("n", "<C-h>", ":NvimTreeToggle<CR>", { silent = true, noremap = true })

-- C++ et C support
vim.api.nvim_create_autocmd("FileType", {
    pattern = { "cpp", "c" },
    callback = function()
        local compiler = vim.bo.filetype == "cpp" and "g++" or "gcc"
        vim.keymap.set("n", "<F5>", ":w<CR>:!" .. compiler .. " % -o %:r && ./%:r<CR>",
            { buffer = true, desc = "Compile and run " .. vim.bo.filetype })
    end,
})

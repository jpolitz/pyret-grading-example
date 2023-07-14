import gdrive-sheets as sheets

imported-my-table =
  sheets.load-spreadsheet("1BAexzf08Q5o8bXb_k8PwuE3tMKezxRfbKBKT-4L6UzI")

imported-my-table


people-table = load-table: name :: String, age :: Number, favorite-color :: String
  source: imported-my-table.sheet-by-name("3-rows", true)
end

fun max(l):
  cases(List) l:
    | empty => 0
    | link(val, rest) =>
      maxrest = max(rest)
      if val > maxrest: val
      else: maxrest
      end
  end
end

fun max-age(t):
  max(t.column("age"))
end

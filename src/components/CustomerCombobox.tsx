"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCustomerSearch } from "@/lib/hooks/useCustomerSearch";
import { useDebounce } from "@/lib/hooks/useDebounce";

interface ComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

function CustomerCombobox({ value, onChange }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { customers, isFetching, searchCustomers } = useCustomerSearch();
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (open) {
      searchCustomers(debouncedSearch, 5);
    }
  }, [debouncedSearch, open]);

  const selectedCustomer = customers.find((c) => c.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {selectedCustomer
            ? `${selectedCustomer.name} ${selectedCustomer.lastname}`
            : "Seleccionar un cliente"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[100%] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Buscar un cliente"
            value={search}
            onValueChange={setSearch}
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>
              {isFetching ? "Buscando..." : "Sin resultados"}
            </CommandEmpty>
            <CommandGroup>
              {customers.map((customer) => (
                <CommandItem
                  key={customer.id}
                  value={customer.id}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  {customer.name} {customer.lastname}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === customer.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default CustomerCombobox;

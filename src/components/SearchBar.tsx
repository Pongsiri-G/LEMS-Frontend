import { Search } from "lucide-react";

import { ReactNode, useEffect, useState } from "react";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Selection, SharedSelection } from "@heroui/react";
import { apiClient } from "../services/apiClient";
import { AxiosResponse } from "axios";

type UserButtonProps = {
  children?: ReactNode;
  rightChildren?: ReactNode
};

type SearchBarProps = UserButtonProps & {
  onSearch?: (params: { name?: string, tag?: string, status?: string }) => void;
  noFilter?: boolean
  wrap?: boolean
};

export default function SearchBar({ children, onSearch, noFilter, rightChildren, wrap }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string>("All");
  const [selectedTags, setSelectedTags] = useState(new Set(["All"]));
  const [allTags, setAllTags] = useState<string[]>();
  const [isReady, setIsReady] = useState(false)

  const selectedTagsString = Array.from(selectedTags).join(",") || "All";

  const onSelectTag = (keys: Selection) => {
    // Convert Selection to Set<string>
    const keysSet = keys === "all"
      ? new Set(allTags)
      : new Set(Array.from(keys).map(String));

    // Handle "All" selection logic
    if (keysSet.has("All")) {
      // If "All" was just selected, clear other selections
      if (!selectedTags.has("All")) {
        setSelectedTags(new Set(["All"]));
      } else if (keysSet.size > 1) {
        keysSet.delete("All");
        setSelectedTags(keysSet);
      }
    } else if (keysSet.size === 0) {
      // If nothing is selected, default to "All"
      setSelectedTags(new Set(["All"]));
    } else {
      setSelectedTags(keysSet);
    }
  }

  const onSelect = (key: SharedSelection) => {
    setSelected(key.currentKey ?? "All")
    console.log(key)
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      console.log(selectedTagsString)
      if (onSearch) onSearch({ name: query.trim(), status: selected === "All" ? "" : selected, tag: selectedTagsString === "All" ? "" : selectedTagsString });
    }, 400); // debounce 400ms

    return () => clearTimeout(delay);
  }, [query, selected, selectedTagsString]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        interface tagResponse {
          id: string
          name: string
          color: string
        }

        const res: AxiosResponse<tagResponse[]> = await apiClient.get("/v1/tags")

        const tags = res.data.map((tag) => tag.name);

        setAllTags(tags)
        setIsReady(true)
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    }
    fetchTags()
  }, [])

  if (!isReady) return;


  return <div className="flex justify-center w-full mt-5 z-10">
    <div className="flex flex-col items-center w-full max-w gap-4">
      <div className="flex md:flex-row flex-col items-center w-full gap-4  max-w-[1300px]">
        <div className="flex justify-end w-fit ">
          {children ?? null}
        </div>

        <div className="relative  w-full flex flex-col  flex-1 ">
          <div className=" relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="ค้นหา..."
              className="w-full h-12 pl-10 pr-4 border rounded-full text-start outline-none border-neutral-300 focus:border-neutral bg-background"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          {rightChildren &&
            <div className="flex justify-center gap-5 mt-3">

              <Dropdown className="hover:scale-95">
                <DropdownTrigger>
                  <Button className="flex capitalize bg-white whitespace-normal w-full max-w-[200px] h-10 overflow-hidden text-left" variant="bordered">
                    <span className="font-bold">Tag:</span>
                    <span className="truncate">{selectedTagsString.replaceAll(",", ", ")}</span>

                  </Button>
                </DropdownTrigger>

                <DropdownMenu
                  aria-label="Multiple selection with checkboxes"
                  variant="shadow"
                  closeOnSelect={false}
                  selectionMode="multiple"
                  selectedKeys={selectedTags}
                  onSelectionChange={onSelectTag}
                  className="overflow-auto max-h-40"
                >
                  {allTags!.map((tag) => (
                    <DropdownItem key={tag}>{tag}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>

              <Dropdown className="hover:scale-95">
                <DropdownTrigger>
                  <Button className="capitalize w-full max-w-[200px] h-10 bg-white" variant="bordered">
                    <span className="font-bold">Status:</span>{selected}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Single selection example"
                  selectedKeys={selected}
                  selectionMode="single"
                  variant="shadow"
                  onSelectionChange={onSelect}
                >
                  <DropdownItem key="All" className="">All</DropdownItem>
                  <DropdownItem key="Available">Available </DropdownItem>
                  <DropdownItem key="Unavailable">UnAvailable </DropdownItem>
                  <DropdownItem key="InLabOnly">InLabOnly </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          }
        </div>
        {rightChildren &&
          <div className="flex justify-start">
            {rightChildren ?? null}
          </div>
        }
        {!noFilter && !rightChildren && (
          <div className="flex justify-end gap-5 ">

            <Dropdown className="hover:scale-95">
              <DropdownTrigger>
                <Button className="flex capitalize  bg-white whitespace-normal h-10 overflow-hidden text-left" variant="bordered">
                  <span className="font-bold">Tag:</span>
                  <span className="truncate">{selectedTagsString.replaceAll(",", ", ")}</span>

                </Button>
              </DropdownTrigger>

              <DropdownMenu
                aria-label="Multiple selection with checkboxes"
                variant="shadow"
                closeOnSelect={false}
                selectionMode="multiple"
                selectedKeys={selectedTags}
                onSelectionChange={onSelectTag}
                className="overflow-auto max-h-40"
              >
                {allTags!.map((tag) => (
                  <DropdownItem key={tag}>{tag}</DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            <Dropdown className="hover:scale-95 ">
              <DropdownTrigger>
                <Button className="capitalize h-10 bg-white " variant="bordered">
                  <span className="font-bold">Status:</span>{selected}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Single selection example"
                selectedKeys={selected}
                selectionMode="single"
                variant="shadow"
                onSelectionChange={onSelect}
              >
                <DropdownItem key="All" className="">All</DropdownItem>
                <DropdownItem key="Available">Available </DropdownItem>
                <DropdownItem key="Unavailable">UnAvailable </DropdownItem>
                <DropdownItem key="InLabOnly">InLabOnly </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )}
      </div>



      {/* <button className="z-10 h-10 px-6 w-45 rounded-full  text-foreground font-[400] text-[16px] cursor-pointer 
                            hover:scale-90 transition-all flex items-center justify-center active:scale-100 
                            border-neutral border-1 backdrop-blur-2xl"
                            onClick={() => onSearch?.(query.trim())}
                            >
          ค้นหา
        </button> */}

    </div>
  </div>
}

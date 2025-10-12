import { getMe } from "./getMe";

export const useHandleGetMe = async () => {
    const res = await getMe()

    return {
        user: res.data,
    }
}

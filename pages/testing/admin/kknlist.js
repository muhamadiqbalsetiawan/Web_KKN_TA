import { AnggotakknList } from "@/components/testing/admin/AnggotakknList"
import Link from "next/link"

export default function kknlist() {
    return(
        <div>
                <AnggotakknList/> <br/>
                <Link href="/mahasiswa/protected">Protected</Link>
        </div>
    )
}
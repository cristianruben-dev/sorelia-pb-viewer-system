"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import { UserCreateDialog } from "@/components/admin/user-create-dialog";
import { createUserColumns } from "@/components/tables/user-columns";
import type { UserWithRoles } from "@/lib/access-control";

interface UsersManagementProps {
	users: UserWithRoles[];
}

export function UsersManagement({ users }: UsersManagementProps) {
	const [showCreateDialog, setShowCreateDialog] = useState(false);

	const handleSuccess = async () => {
		setShowCreateDialog(false);
		window.location.reload();
	};

	const handleRolesUpdated = () => {
		window.location.reload();
	};

	// Crear las columnas con el callback
	const columns = createUserColumns(handleRolesUpdated);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<Button onClick={() => setShowCreateDialog(true)}>
					<Plus className="mr-2 h-4 w-4" />
					Nuevo Usuario
				</Button>
			</div>

			<Card>
				<CardContent>
					<DataTable data={users} columns={columns} />
				</CardContent>
			</Card>

			<UserCreateDialog
				open={showCreateDialog}
				onOpenChange={setShowCreateDialog}
				onSuccess={handleSuccess}
			/>
		</div>
	);
}

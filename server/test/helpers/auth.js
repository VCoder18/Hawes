"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTestUser = createTestUser;
exports.deleteTestUser = deleteTestUser;
async function createTestUser(supabase, email) {
    const { data: { session }, error, } = await supabase.auth.signUp({
        email,
        password: 'ilikeskibidi67',
    });
    if (error || !session)
        throw new Error(`Failed to create test user: ${error?.message}`);
    return session;
}
async function deleteTestUser(adminSupabase, userId) {
    await adminSupabase.auth.admin.deleteUser(userId);
}
//# sourceMappingURL=auth.js.map
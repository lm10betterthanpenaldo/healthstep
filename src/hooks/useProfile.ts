import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProfileService, Profile } from '@/services/profile.service';
import { useAuth } from '@/context/auth-provider';

export function useProfile() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Fetch profile
    const { data: profile, isLoading, error } = useQuery<Profile | null>({
        queryKey: ['profile', user?.id],
        queryFn: () => user?.id ? ProfileService.getProfile(user.id) : null,
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    });

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: ({ userId, updates }: { userId: string; updates: Partial<Profile> }) =>
            ProfileService.updateProfile(userId, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
        },
    });

    // Update avatar mutation
    const updateAvatarMutation = useMutation({
        mutationFn: (userId: string) => ProfileService.updateAvatar(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
        },
    });

    return {
        profile,
        isLoading,
        error,
        updateProfile: updateProfileMutation.mutateAsync,
        updateAvatar: updateAvatarMutation.mutateAsync,
        isUpdating: updateProfileMutation.isPending,
        isUploadingAvatar: updateAvatarMutation.isPending,
    };
}

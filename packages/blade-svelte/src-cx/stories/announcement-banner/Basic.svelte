<script lang="ts">
  import { AnnouncementBanner, type AnnouncementBannerStyleProps } from '../../index';
  import { OffersIcon } from '../../icons';

  interface Props {
    args: AnnouncementBannerStyleProps & { withIcon?: boolean; content?: string };
  }

  let { args }: Props = $props();
</script>

<AnnouncementBanner alignment={args.alignment} icon={args.withIcon ? OffersIcon : undefined}>
  {args.content}
</AnnouncementBanner>
